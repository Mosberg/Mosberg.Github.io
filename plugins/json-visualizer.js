// json-visualizer.js
PerchancePlugin({
  id: "json-visualizer",
  name: "JSON Visualizer & Converter",
  version: "1.0.0",
  author: "Rasmus",
  description: "Visualize, convert, and validate structured data with interactive graphs and advanced tools.",
  tags: ["json", "visualizer", "converter", "schema", "tools"],
  manifest: {
    modes: ["dark", "light"],
    formats: ["json", "yaml", "csv", "xml", "toml"],
    exportTypes: ["png", "jpeg", "svg"],
    codeTargets: ["typescript", "golang", "jsonschema"],
    tools: ["jwtDecode", "jqQuery", "randomizer"]
  },

  state: {
    inputData: "",
    inputFormat: "json",
    outputFormat: "json",
    theme: "dark",
    graphData: null,
    validationResult: null,
    generatedCode: "",
    schema: "",
    exportType: "svg"
  },

  ui: () => {
    section("📥 Input & Format")
    textarea("Input Data", "inputData")
    dropdown("Input Format", "inputFormat", state.formats)
    dropdown("Theme", "theme", ["dark", "light"])

    section("🔄 Convert & Validate")
    dropdown("Convert To", "outputFormat", state.formats)
    button("Convert", convertData)
    button("Beautify & Validate", validateData)

    section("🧠 Code Generation")
    dropdown("Generate For", "codeTarget", state.codeTargets)
    button("Generate Code", generateCode)

    section("📐 JSON Schema Tools")
    button("Generate Schema", generateSchema)
    button("Mock Data from Schema", mockFromSchema)
    button("Validate Against Schema", validateAgainstSchema)

    section("🛠️ Advanced Tools")
    button("Decode JWT", decodeJWT)
    button("Run jq/JSONPath", runQuery)
    button("Randomize Data", randomizeData)

    section("📊 Visualization & Export")
    button("Visualize Graph", visualizeGraph)
    dropdown("Export As", "exportType", state.exportTypes)
    button("Export Image", exportImage)

    section("🔒 Privacy")
    text("All processing is local. No data is stored or sent to servers.")
  },

  functions: {
    convertData: () => {
      // Convert between formats using internal logic or external libraries
      state.inputData = convertFormat(state.inputData, state.inputFormat, state.outputFormat)
    },

    validateData: () => {
      state.validationResult = validateAndBeautify(state.inputData, state.inputFormat)
    },

    generateCode: () => {
      state.generatedCode = generateCodeFromJSON(state.inputData, state.codeTarget)
    },

    generateSchema: () => {
      state.schema = generateJSONSchema(state.inputData)
    },

    mockFromSchema: () => {
      state.inputData = mockDataFromSchema(state.schema)
    },

    validateAgainstSchema: () => {
      state.validationResult = validateWithSchema(state.inputData, state.schema)
    },

    decodeJWT: () => {
      state.inputData = decodeJWT(state.inputData)
    },

    runQuery: () => {
      state.inputData = runJQorJSONPath(state.inputData)
    },

    randomizeData: () => {
      state.inputData = randomizeJSON(state.inputData)
    },

    visualizeGraph: () => {
      state.graphData = parseToGraph(state.inputData, state.inputFormat)
    },

    exportImage: () => {
      exportGraphAsImage(state.graphData, state.exportType)
    }
  }
})