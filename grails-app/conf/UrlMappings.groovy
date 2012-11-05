class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

		"/$action?/$id?"(controller: "mviewer")

		"500"(view:'/error')
	}
}
