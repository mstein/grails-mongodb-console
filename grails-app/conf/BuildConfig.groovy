grails.project.work.dir = 'target'

grails.project.dependency.resolution = {

    inherits 'global'
    log 'warn'

    repositories {
        grailsCentral()
        mavenLocal()
        mavenCentral()
    }

    dependencies {
        // Mongo DB Groovy driver
        compile group: 'com.gmongo', name: 'gmongo', version: "1.0"
        compile group: 'org.mongodb', name: 'mongo-java-driver', version: "2.7.3"
    }

    plugins {
        build ':release:2.2.1', ':rest-client-builder:1.0.3', {
            export = false
        }
    }
}
