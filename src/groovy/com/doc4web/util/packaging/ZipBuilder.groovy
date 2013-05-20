/**
 * ZipBuilder utils
 * Author : Manuarii Stein <mstein@doc4web.com>
 */
package com.doc4web.util.packaging

import groovy.transform.InheritConstructors

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class ZipBuilder {

    @InheritConstructors
    static class NonClosingOutputStream extends FilterOutputStream {
        void close() {
            // do nothing
        }
    }

    ZipOutputStream zos
    Stack<String> pathStack
    HashSet<String> existingPaths
    /**
     * Create a new instance of ZipBuilder
     * @param os
     * @return
     */
    ZipBuilder(OutputStream os) {
        zos = new ZipOutputStream(os)
        pathStack = new Stack<String>()
        existingPaths = new HashSet<String>()
    }

    /**
     * Start the zip build procedure
     *
     * @param closure
     */
    void zip(Closure closure) {
        closure.delegate = this
        closure.call()
        zos.close()

        // clear existingPath hashset for each call to "zip"
        existingPaths.clear()
    }

    /**
     * Adds a file to the zip output at the current path
     *
     * @param file The File to add
     */
    void file(File inputFile) {
        file(inputFile.name, inputFile.newInputStream())
    }

    /**
     * Adds a file with the specified name to the zip output at the current path
     *
     * @param name The name of the file
     * @param file The file to add
     */
    void file(String name, File inputFile) {
        file(name, inputFile.newInputStream())
    }

    /**
     * Adds a new file containing the specified String content at the current path
     *
     * @param name The name of the file
     * @param content The content of the file
     */
    void file(String name, String content) {
        fileAtCurrent(name) {
            org.apache.commons.io.IOUtils.copy(new StringReader(content), zos, 'utf-8')
        }
    }

    /**
     * Adds a file from the specified InputStream at the current path
     *
     * @param name The name of the resulting file in the zip
     * @param input The InputStream
     */
    void file(String name, InputStream input) {
        fileAtCurrent(name) {
            org.apache.commons.io.IOUtils.copy(input, zos)
            input.close()
        }
    }

    /**
     * Adds a file from the specified ByteArray at the current path
     *
     * @param name The name of the resulting file in the zip
     * @param content The ByteArray representing the content of the file
     */
    void file(String name, byte[] content) {
        fileAtCurrent(name) {
            zos.write(content)
        }
    }

    /**
     * Adds a file from the specified ByteArrayOutputStream at the current path
     *
     * @param name The name of the resulting file in the zip
     * @param content The ByteArrayOutputStream representing the content of the file
     */
    void file(String name, ByteArrayOutputStream content) {
        fileAtCurrent(name) {
            content.writeTo(zos)
        }
    }

    /**
     * Convenience method for adding a new file entry at the current path
     * @param name
     * @param clos
     */
    private fileAtCurrent(String name, Closure clos) {
        def basePath = pathStack.join(File.separator) ?: ''
        basePath = basePath ? basePath + File.separator : ''

        zos.putNextEntry(new ZipEntry(handleDuplicateFilename(basePath + name)))

        clos()
        zos.closeEntry()
    }

    /**
     * Handle duplicate filename by appending "(duplicate)" in the string filename until it become unique in its path
     * @param path
     * @return The unique path generated
     */
    private String handleDuplicateFilename(String path) {
        if(!path) path = ""

        if(!existingPaths.add(path)) {
            // if the hashset add() method return false, then the path already exists in this archive
            // we append the a string to make it unique
            if(path.lastIndexOf('.') != -1) {
                // Append the string before the extension if there is any
                def idx = path.lastIndexOf('.')
                path= path.substring(0, idx) + " (duplicate)" + path.substring(idx, path.size())
            } else {
                path = path + " (duplicate)"
            }
            path = handleDuplicateFilename(path)
        }
        path
    }

    /**
     * Convenient method used to generate the path structure in a groovy-manner
     *
     * @param name Name of the directory
     * @param args A closure containing the file to add
     * @return
     */
    public Object invokeMethod(String name, Object args) {
        // Folder creation
        def clos = args[0]
        if (clos instanceof Closure) {
            pathStack.push(name)
            zos.putNextEntry(new ZipEntry(pathStack.join(File.separator) + File.separator))
            zos.closeEntry()

            clos.delegate = this
            NonClosingOutputStream ncos = new NonClosingOutputStream(zos)
            clos.call(ncos)
            pathStack.pop()
        }
        return null
    }
}
