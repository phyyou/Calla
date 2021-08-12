import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { getSongInfo, ISongInfo } from "./api/song";

export default function Home({ song }: { song: ISongInfo }) {
  return (
    <>
      <Head>
        <title>Calla</title>
        <meta name="description" content="Recomend Random Classical Music" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ height: "100%", display: "grid", placeContent: "center" }}>
        <video controls={true} autoPlay={true} loop={true}>
          <source src={song.file}></source>
        </video>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const song = await getSongInfo();

  return { props: { song } };
};
