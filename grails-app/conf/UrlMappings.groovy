class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

        "/mongo/$dbname?/$colname?" {
            controller = "mviewer"
            action = "dispatchLink"
        }

		"/$action?/$id?"(controller: "mviewer")

		"500"(view:'/error')
	}
}
