class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

        "/mongo/$dbname?/$colname?" {
            controller = "mviewer"
            action = "index"
        }

		"/$action?/$id?"(controller: "mviewer")

		"500"(view:'/error')
	}
}
