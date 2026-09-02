export default {
  name: "Indie Founder Radar",
  description: "AI agent that validates startup ideas by searching the web for real user pain points, competitor weaknesses, and market gaps — then delivers a BUILD or SKIP verdict.",
  version: "1.0.0",
  type: "template" as const,
  author: { name: "Ragotma", email: "ragotmaragavendar@gmail.com" },
  tags: ["research", "startup", "validation", "web-search", "market-analysis"],
  steps: [
    { id: "indie-founder-radar", type: "mandatory" as const }
  ],
  links: {
    github: "https://github.com/RaghPIP/AgentKit/tree/main/kits/indie-founder-radar"
  }
};