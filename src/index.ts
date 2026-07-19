import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";

const app = new Hono();

app.get("/api/servers", (c) => {
/*export class App extends DurableObject {*/
 /* private app = new Hono()*/
    /*.get("/api/servers", (c) => {*/
      // Mock data for Minecraft servers
      const servers = [
        {
          id: "Vanilla",
          name: "Vanilla World",
          mapUrl: "http://mc.bullseyegaming.pro:8100", // Placeholder BlueMap
          players: 12,
          maxPlayers: 50,
          status: "online",
          version: "1.21"
        },
        {
          id: "ATM10",
          name: "ATM10 Realm",
          mapUrl: "https://demo.bluemap.io/#coords:100,64,100,0,0,0",
          players: 5,
          maxPlayers: 20,
          status: "online",
          version: "1.21"
        },
        {
          id: "factions",
          name: "Factions Hub",
          mapUrl: "https://demo.bluemap.io/#coords:-500,64,200,0,0,0",
          players: 42,
          maxPlayers: 100,
          status: "online",
          version: "1.21"
        },
        {
          id: "hardcore",
          name: "Hardcore Island",
          mapUrl: "https://demo.bluemap.io/",
          players: 0,
          maxPlayers: 10,
          status: "offline",
          version: "1.20.4"
        }
      ];
      return c.json(servers);
    });

    export default app;

/*  async fetch(request: Request) {
    return this.app.fetch(request);
  }
}*/

