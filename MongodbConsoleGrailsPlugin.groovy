import com.gmongo.GMongo

class MongodbConsoleGrailsPlugin {
    def version = "0.1"
    def grailsVersion = "2.0 > *"
    def pluginExcludes = [
            "web-app/images/gh/*"
    ]

    def loadAfter = ['mongodb']

    def title = "MongoDB Console Grails Plugin"
    def author = "Manuarii Stein"
    def authorEmail = "mstein@doc4web.com"
    def description = 'A web GUI for mongodb as a grails plugin.'

    def documentation = "http://grails.org/plugin/mongodb-console"

    def license = "APACHE"
    def developers = [ [ name: "Damien Vitrac", email: "dvitrac@doc4web.com" ]]
    def issueManagement = [system: "JIRA", url: "https://github.com/mstein/grails-mongodb-console/issues"]
    def scm = [url: "https://github.com/mstein/grails-mongodb-console"]

    def doWithSpring = {
        // If the official mongodb plugin is installed, it uses the configured GMongo bean, otherwise, create
        // a new one
        if(!manager.hasGrailsPlugin('mongodb')) {
            mongo(GMongo, 'localhost', 27017)
        }
        mongoViewerService(MongoViewerService) {
            mongo = ref('mongo')
        }
    }
}
