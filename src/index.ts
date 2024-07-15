import client from "ari-client";
import waitOn from "wait-on";

const url = "localhost:8088";
const username = "username";
const password = "password";

const connect = async (): Promise<client.Client | undefined> => {
  try {
    const ariClient = await client.connect(`http://${url}`, username, password);
    return ariClient;
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  try {
    await waitOn({
      resources: [`http-get://${url}/ari/asterisk/info`],
      delay: 1000,
      simultaneous: 1,
      timeout: 30000,
      auth: {
        username,
        password,
      },
    });
    const ariClient = await connect();
    if (ariClient) {
      console.log("Connected to ARI");

      ariClient.on("StasisStart", (event: any, channel: any) => {
        console.log(event);
        console.log(channel);
      });

      ariClient.on("StasisEnd",  () => {
        console.log('StasisEnd');
      });

      await ariClient.start("vocoo-voice");
    }
  } catch (error) {}
})
