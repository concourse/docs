def generateRoutes(section):
  created = {}

  for route in section.routes:
    toRoute = "{}/{}.md".format(section.root, route["to"])

    if hasattr(route, "html_only") and route["html_only"]:
      created.update({"{}.html.md".format(route["from"]): toRoute})
    else:
      created.update({"{}.html.md".format(route["from"]): toRoute})
      created.update({"{}.md".format(route["from"]): toRoute})
    end

  end

  return created
end