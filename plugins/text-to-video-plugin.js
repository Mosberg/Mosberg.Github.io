plugin("text-to-video-plugin", {
  name: "Text to Video Generator",
  author: "Mosberg",
  version: "1.0",
  description:
    "Generates mock video metadata from descriptive prompts. Designed for extensibility with real video APIs.",
  tags: ["video", "AI", "prompt", "generator", "plugin"],

  input: [
    {
      id: "videoPrompt",
      label: "Describe your video",
      type: "textarea",
      placeholder: "e.g. A futuristic cityscape at sunset with flying cars",
    },
    {
      id: "style",
      label: "Visual Style",
      type: "dropdown",
      options: ["Cinematic", "Anime", "Realistic", "Cartoon", "Surreal"],
      default: "Cinematic",
    },
    {
      id: "duration",
      label: "Duration (seconds)",
      type: "number",
      min: 5,
      max: 120,
      default: 30,
    },
    {
      id: "resolution",
      label: "Resolution",
      type: "dropdown",
      options: ["720p", "1080p", "4K"],
      default: "1080p",
    },
  ],

  output: (input) => {
    const { videoPrompt, style, duration, resolution } = input;

    const mockVideoID =
      crypto.randomUUID?.() || Math.random().toString(36).slice(2);
    const timestamp = new Date().toISOString();

    return `
🎬 **Video Metadata**
- **Prompt**: ${videoPrompt}
- **Style**: ${style}
- **Duration**: ${duration}s
- **Resolution**: ${resolution}
- **Generated ID**: ${mockVideoID}
- **Timestamp**: ${timestamp}

🧠 *This is a simulated output. You can extend this plugin to call real video generation APIs or embed previews.*
`;
  },
});
