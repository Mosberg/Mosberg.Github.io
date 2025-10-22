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
    codeTarget: "typescript"
  };

  // Load external libraries
  const yaml = global.jsyaml;
  const xmljs = global.xmljs;
  const toml = global.toml;
  const Papa = global.Papa;

  function convertFormat(data, from, to) {
    try {
      let parsed;
      switch (from) {
        case "json":
          parsed = JSON.parse(data);
          break;
        case "yaml":
          parsed = yaml.load(data);
          break;
        case "csv":
          parsed = Papa.parse(data, { header: true }).data;
          break;
        case "xml":
          parsed = xmljs.xml2js(data, { compact: true });
          break;
        case "toml":
          parsed = toml.parse(data);
          break;
        default:
          throw new Error("Unsupported input format");
      }

      switch (to) {
        case "json":
          return JSON.stringify(parsed, null, 2);
        case "yaml":
          return yaml.dump(parsed);
        case "csv":
          return Papa.unparse(parsed);
        case "xml":
          return xmljs.js2xml(parsed, { compact: true, spaces: 2 });
        case "toml":
          return toml.stringify(parsed);
        default:
          throw new Error("Unsupported output format");
      }
    } catch (e) {
      return `Error: ${e.message}`;
    }
  }

  function validateAndBeautify(data, format) {
    try {
      let parsed;
      switch (format) {
        case "json":
          parsed = JSON.parse(data);
          return { valid: true, beautified: JSON.stringify(parsed, null, 2) };
        case "yaml":
          parsed = yaml.load(data);
          return { valid: true, beautified: yaml.dump(parsed) };
        case "csv":
          parsed = Papa.parse(data);
          return { valid: !parsed.errors.length, beautified: Papa.unparse(parsed.data) };
        case "xml":
          parsed = xmljs.xml2js(data, { compact: true });
          return { valid: true, beautified: xmljs.js2xml(parsed, { compact: true, spaces: 2 }) };
        case "toml":
          parsed = toml.parse(data);
          return { valid: true, beautified: toml.stringify(parsed) };
        default:
          return { valid: false, beautified: data };
      }
    } catch (e) {
      return { valid: false, beautified: `Error: ${e.message}` };
    }
  }

  function generateCodeFromJSON(data, target) {
    try {
      const obj = JSON.parse(data);
      if (target === "typescript") {
        return Object.entries(obj)
          .map(([key, value]) => `  ${key}: ${typeof value};`)
          .join("\n");
      }
      if (target === "golang") {
        return Object.entries(obj)
          .map(([key, value]) => `  ${key} ${typeof value === "number" ? "int" : "string"}`)
          .join("\n");
      }
      if (target === "jsonschema") {
        return JSON.stringify({
          type: "object",
          properties: Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
              key,
              { type: typeof value }
            ])
          )
        }, null, 2);
      }
    } catch (e) {
      return `Error: ${e.message}`;
    }
  }

  function generateJSONSchema(data) {
    return generateCodeFromJSON(data, "jsonschema");
  }

  function mockDataFromSchema(schema) {
    return JSON.stringify({ mock: true }, null, 2);
  }

  function validateWithSchema(data, schema) {
    return { valid: true };
  }

  function decodeJWT(data) {
    try {
      const parts = data.split(".");
      const decoded = parts.map(p => JSON.parse(atob(p)));
      return JSON.stringify(decoded, null, 2);
    } catch (e) {
      return `Error decoding JWT: ${e.message}`;
    }
  }

  function runJQorJSONPath(data) {
    return data; // placeholder
  }

  function randomizeJSON(data) {
    return data; // placeholder
  }

  function parseToGraph(data, format) {
    try {
      const parsed = JSON.parse(convertFormat(data, format, "json"));
      return parsed;
    } catch {
      return { error: "Unable to parse graph" };
    }
  }

  function exportGraphAsImage(graph, type) {
    console.log("Exporting graph as", type);
  }

  const plugin = {
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
    state,
    functions: {
      convertData: () => {
        state.inputData = convertFormat(state.inputData, state.inputFormat, state.outputFormat);
      },
      validateData: () => {
        state.validationResult = validateAndBeautify(state.inputData, state.inputFormat);
      },
      generateCode: () => {
        state.generatedCode = generateCodeFromJSON(state.inputData, state.codeTarget);
      },
      generateSchema: () => {
        state.schema = generateJSONSchema(state.inputData);
      },
      mockFromSchema: () => {
        state.inputData = mockDataFromSchema(state.schema);
      },
      validateAgainstSchema: () => {
        state.validationResult = validateWithSchema(state.inputData, state.schema);
      },
      decodeJWT: () => {
        state.inputData = decodeJWT(state.inputData);
      },
      runQuery: () => {
        state.inputData = runJQorJSONPath(state.inputData);
      },
      randomizeData: () => {
        state.inputData = randomizeJSON(state.inputData);
      },
      visualizeGraph: () => {
        state.graphData = parseToGraph(state.inputData, state.inputFormat);
      },
      exportImage: () => {
        exportGraphAsImage(state.graphData, state.exportType);
      }
    }
  };

  if (typeof PerchancePlugin === "function") {
    PerchancePlugin(plugin);
  } else {
    global.jsonVisualizer = plugin;
  }
})(window);
