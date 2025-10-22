hljs.highlightAll();

let plugin = window.jsonVisualizer;

function toHierarchy(obj) {
  return {
    name: "root",
    children: Object.entries(obj).map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return { name: key, ...toHierarchy(value) };
      } else {
        return { name: `${key}: ${value}` };
      }
    }),
  };
}

function renderGraph(data) {
  const container = document.getElementById("graph");
  container.innerHTML = "";

  if (!data || typeof data !== "object") {
    container.textContent = "No graph data";
    return;
  }

  const treeData = toHierarchy(data);
  const width = container.clientWidth || 800;
  const height = 500;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("id", "graphSvg")
    .attr("width", width)
    .attr("height", height)
    .call(
      d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform);
      })
    );

  const g = svg.append("g").attr("transform", "translate(80,20)");
  const root = d3.hierarchy(treeData);
  root.descendants().forEach((d) => (d._children = d.children));

  const treeLayout = d3.tree().size([height - 40, width - 160]);
  const tooltip = d3.select("body").append("div").attr("class", "tooltip");

  function update(source) {
    treeLayout(root);
    g.selectAll("line").remove();
    g.selectAll("g.node").remove();

    g.selectAll("line")
      .data(root.links())
      .join("line")
      .attr("stroke", "#999")
      .attr("x1", (d) => d.source.y)
      .attr("y1", (d) => d.source.x)
      .attr("x2", (d) => d.target.y)
      .attr("y2", (d) => d.target.x);

    const node = g
      .selectAll("g.node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`)
      .on("click", (event, d) => {
        if (document.getElementById("collapseNodes").checked) {
          d.children = d.children ? null : d._children;
          update(d);
        }
      })
      .on("mouseover", (event, d) => {
        if (document.getElementById("showTooltips").checked) {
          tooltip
            .style("opacity", 1)
            .html(d.data.name)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + "px");
        }
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    node.append("circle").attr("r", 5).attr("fill", "#007acc");

    node
      .append("text")
      .attr("dy", 3)
      .attr("x", (d) => (d.children ? -10 : 10))
      .style("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name);
  }

  update(root);
}

function convert() {
  plugin.state.outputFormat = document.getElementById("outputFormat").value;
  plugin.functions.convertData();
  document.getElementById("inputData").value = plugin.state.inputData;
}

function validate() {
  plugin.functions.validateData();
  render(
    "validationPreview",
    plugin.state.validationResult.beautified || "Invalid format"
  );
}

function generateCode() {
  plugin.state.codeTarget = document.getElementById("codeTarget").value;
  plugin.functions.generateCode();
  render("codePreview", plugin.state.generatedCode);
}

function generateSchema() {
  plugin.functions.generateSchema();
  render("schemaPreview", plugin.state.schema);
}

function validateAgainstSchema() {
  try {
    const ajv = new Ajv();
    const schema = JSON.parse(plugin.state.schema);
    const data = JSON.parse(plugin.state.inputData);
    const valid = ajv.validate(schema, data);
    plugin.state.validationResult = {
      valid,
      beautified: valid
        ? "✅ Data is valid against schema"
        : "❌ Validation failed:\n" + JSON.stringify(ajv.errors, null, 2),
    };
    render("validationPreview", plugin.state.validationResult.beautified);
  } catch (e) {
    plugin.state.validationResult = {
      valid: false,
      beautified: "❌ Error validating against schema:\n" + e.message,
    };
    render("validationPreview", plugin.state.validationResult.beautified);
  }
}

function exportImage() {
  const format = document.getElementById("exportFormat").value;
  const node = document.getElementById("graphSvg");

  const exportFn = {
    png: htmlToImage.toPng,
    jpeg: htmlToImage.toJpeg,
    svg: htmlToImage.toSvg,
  }[format];

  if (!exportFn) {
    alert("Unsupported format");
    return;
  }

  exportFn(node)
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `graph.${format}`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error("Export failed:", err);
      alert("Export failed");
    });
}

function visualize() {
  plugin.state.inputData = document.getElementById("inputData").value;
  plugin.state.inputFormat = document.getElementById("inputFormat").value;
  plugin.state.theme = document.getElementById("theme").value;
  plugin.functions.visualizeGraph();
  renderGraph(plugin.state.graphData);
}

function render(id, content) {
  const container = document.getElementById(id);
  if (id === "codePreview") {
    const block = document.getElementById("codePreviewBlock");
    block.textContent =
      typeof content === "string" ? content : JSON.stringify(content, null, 2);
    hljs.highlightElement(block);
  } else {
    container.textContent =
      typeof content === "string" ? content : JSON.stringify(content, null, 2);
  }
}

function clearAll() {
  document.getElementById("inputData").value = "";
  [
    "graph",
    "validationPreview",
    "codePreview",
    "schemaPreview",
    "codePreviewBlock",
  ].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
}

function setupDropzone() {
  const dropzone = document.getElementById("dropzone");
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#00ccff";
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "#888";
  });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#888";
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById("inputData").value = reader.result;
        plugin.state.inputData = reader.result;
        plugin.functions.visualizeGraph();
        renderGraph(plugin.state.graphData);
      };
      reader.readAsText(file);
    } else {
      alert("Please drop a valid JSON file.");
    }
  });
}

document.getElementById("theme").addEventListener("change", (e) => {
  document.body.className = e.target.value === "light" ? "light-mode" : "";
});

document.getElementById("inputData").addEventListener("input", () => {
  if (document.getElementById("autoRefresh").checked) {
    plugin.state.inputData = document.getElementById("inputData").value;
    plugin.functions.visualizeGraph();
    renderGraph(plugin.state.graphData);
  }
});

window.addEventListener("DOMContentLoaded", setupDropzone);
