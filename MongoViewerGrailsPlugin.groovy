import com.gmongo.GMongo

class MongoViewerGrailsPlugin {
    // the plugin version
    def version = "0.1"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "2.0 > *"
    // the other plugins this plugin depends on
    def dependsOn = [:]
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/views/error.gsp",
            "web-app/images/gh/*"
    ]

    def loadAfter = ['mongodb']

    // TODO Fill in these fields
    def title = "Grails MongoDB Console" // Headline display name of the plugin
    def author = "Manuarii Stein"
    def authorEmail = "mstein@doc4web.com"
    def description = '''\
A web GUI for mongodb as a grails plugin.
'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/mongo-viewer"

    // Extra (optional) plugin metadata

    // License: one of 'APACHE', 'GPL2', 'GPL3'
//    def license = "APACHE"

    // Details of company behind the plugin (if there is one)
//    def organization = [ name: "My Company", url: "http://www.my-company.com/" ]

    // Any additional developers beyond the author specified above.
    def developers = [ [ name: "Damien Vitrac", email: "dvitrac@doc4web.com" ]]

    // Location of the plugin's issue tracker.
//    def issueManagement = [ system: "JIRA", url: "http://jira.grails.org/browse/GPMYPLUGIN" ]

    // Online location of the plugin's browseable source code.
    def scm = [ url: "https://github.com/mstein/grails-mongodb-console" ]

    def doWithWebDescriptor = { xml ->
        // TODO Implement additions to web.xml (optional), this event occurs before
    }

    def doWithSpring = {
        // If the official mongodb plugin is installed, it uses the configured GMongo bean, otherwise, create
        // a new one
        if(!manager.hasGrailsPlugin('mongodb')) {
            mongo(GMongo, 'localhost', 27017){

            }
        }
        mongoViewerService(MongoViewerService) {
            mongo = ref('mongo')
        }
    }

    def doWithDynamicMethods = { ctx ->
        // TODO Implement registering dynamic methods to classes (optional)
    }

    def doWithApplicationContext = { applicationContext ->
        // TODO Implement post initialization spring config (optional)
    }

    def onChange = { event ->
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    def onConfigChange = { event ->
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }

    def onShutdown = { event ->
        // TODO Implement code that is executed when the application shuts down (optional)
    }
}
