(function (global) {
  const state = {
    inputData: "",
    inputFormat: "json",
    outputFormat: "json",
    theme: "dark",
    graphData: null,
    validationResult: null,
    generatedCode: "",
    schema: "",
    exportType: "svg",
    codeTarget: "typescript",
  };

  const yaml = global.jsyaml;
  const xmljs = global.xmljs;
  const toml = global.toml;
  const Papa = global.Papa;

  function parse(input, format) {
    switch (format) {
      case "json":
        return JSON.parse(input);
      case "yaml":
        return yaml.load(input);
      case "csv":
        return Papa.parse(input, { header: true }).data;
      case "xml":
        return xmljs.xml2js(input, { compact: true });
      case "toml":
        return toml.parse(input);
      default:
        throw new Error("Unsupported format: " + format);
    }
  }

  function stringify(data, format) {
    switch (format) {
      case "json":
        return JSON.stringify(data, null, 2);
      case "yaml":
        return yaml.dump(data);
      case "csv":
        return Papa.unparse(data);
      case "xml":
        return xmljs.js2xml(data, { compact: true, spaces: 2 });
      case "toml":
        return toml.stringify(data);
      default:
        throw new Error("Unsupported format: " + format);
    }
  }

  function convertData() {
    try {
      const parsed = parse(state.inputData, state.inputFormat);
      state.inputData = stringify(parsed, state.outputFormat);
    } catch (e) {
      state.inputData = "Error: " + e.message;
    }
  }

  function validateData() {
    try {
      const parsed = parse(state.inputData, state.inputFormat);
      state.validationResult = {
        valid: true,
        beautified: stringify(parsed, state.inputFormat),
      };
    } catch (e) {
      state.validationResult = {
        valid: false,
        beautified: "Error: " + e.message,
      };
    }
  }

  function generateCode() {
    try {
      const obj = parse(state.inputData, state.inputFormat);
      const entries = Object.entries(obj);
      if (state.codeTarget === "typescript") {
        state.generatedCode = entries
          .map(([k, v]) => `  ${k}: ${typeof v};`)
          .join("\n");
      } else if (state.codeTarget === "golang") {
        state.generatedCode = entries
          .map(([k, v]) => `  ${k} ${typeof v === "number" ? "int" : "string"}`)
          .join("\n");
      } else if (state.codeTarget === "rust") {
        state.generatedCode = entries
          .map(
            ([k, v]) => `  ${k}: ${typeof v === "number" ? "i32" : "String"},`
          )
          .join("\n");
      } else if (state.codeTarget === "jsonschema") {
        state.generatedCode = JSON.stringify(
          {
            type: "object",
            properties: Object.fromEntries(
              entries.map(([k, v]) => [k, { type: typeof v }])
            ),
          },
          null,
          2
        );
      }
    } catch (e) {
      state.generatedCode = "Error: " + e.message;
    }
  }

  function generateSchema() {
    generateCode();
    if (state.codeTarget !== "jsonschema") {
      state.codeTarget = "jsonschema";
      generateCode();
    }
    state.schema = state.generatedCode;
  }

  function mockFromSchema() {
    state.inputData = JSON.stringify({ mock: true }, null, 2);
  }

  function validateAgainstSchema() {
    state.validationResult = {
      valid: true,
      message: "Schema validation placeholder",
    };
  }

  function decodeJWT() {
    try {
      const parts = state.inputData.split(".");
      const decoded = parts.map((p) => JSON.parse(atob(p)));
      state.inputData = JSON.stringify(decoded, null, 2);
    } catch (e) {
      state.inputData = "Error decoding JWT: " + e.message;
    }
  }

  function runQuery() {
    state.inputData = "// jq/JSONPath not implemented";
  }

  function randomizeData() {
    state.inputData = JSON.stringify({ randomized: Math.random() }, null, 2);
  }

  function visualizeGraph() {
    try {
      const parsed = parse(state.inputData, state.inputFormat);
      state.graphData = parsed;
    } catch (e) {
      state.graphData = { error: e.message };
    }
  }

  function exportImage() {
    console.log("Export placeholder:", state.exportType);
  }

  const plugin = {
    id: "json-visualizer",
    name: "JSON Visualizer & Converter",
    version: "1.0.0",
    author: "Rasmus",
    description:
      "Visualize, convert, and validate structured data with interactive graphs and advanced tools.",
    tags: ["json", "visualizer", "converter", "schema", "tools"],
    manifest: {
      modes: ["dark", "light"],
      formats: ["json", "yaml", "csv", "xml", "toml"],
      exportTypes: ["png", "jpeg", "svg"],
      codeTargets: ["typescript", "golang", "rust", "jsonschema"],
      tools: ["jwtDecode", "jqQuery", "randomizer"],
    },
    state,
    functions: {
      convertData,
      validateData,
      generateCode,
      generateSchema,
      mockFromSchema,
      validateAgainstSchema,
      decodeJWT,
      runQuery,
      randomizeData,
      visualizeGraph,
      exportImage,
    },
  };

  if (typeof PerchancePlugin === "function") {
    PerchancePlugin(plugin);
  } else {
    global.jsonVisualizer = plugin;
  }
})(window);
