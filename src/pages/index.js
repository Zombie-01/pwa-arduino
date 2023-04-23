import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

async function sendDataToESP8266(data) {
  if ("bluetooth" in navigator) {
    const scan = document.querySelector("#scan");
    const batteryIndicator = document.querySelector("#battery-indicator");

    scan &&
      scan.addEventListener("click", async () => {
        alert("scan is wrking");
        const connectToDevice = async ({ bleService, bleCharacteristic }) => {
          try {
            const device = await navigator.bluetooth.requestDevice({
              filters: [
                {
                  services: [bleService]
                }
              ]
            });

            device.addEventListener("gattserverdisconnected", () => {
              batteryIndicator.value = 0;
            });

            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(bleService);
            const characteristic = await service.getCharacteristic(
              bleCharacteristic
            );
            await characteristic.startNotifications();

            characteristic.addEventListener(
              "characteristicvaluechanged",
              (e) => {
                const value = e.target.value.getUint8(0);

                console.log(`${bleCharacteristic} changed`, value);

                batteryIndicator.value = value;
              }
            );

            characteristic.readValue();

            return characteristic;
          } catch (err) {
            console.error(err);
          }
        };

        await connectToDevice({
          bleService: "battery_service",
          bleCharacteristic: "battery_level"
        });
      });
  }
}

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#000000" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>src/pages/index.js</code>
          </p>
        </div>

        <button onClick={() => sendDataToESP8266(45)}>send data</button>
      </main>
    </>
  );
}
