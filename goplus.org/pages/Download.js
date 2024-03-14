import React, { useState, useEffect, HTMLAttributes } from 'react';
import Head from 'next/head';
import styles from './style.module.scss';
import Layout from 'components/Layout';
// import GithubReleases, { GithubStableReleases } from './download/GithubReleases';

export default function Home({releases}) {

  const [selectedRelease, setSelectedRelease] = useState(null);

  const toggleReleaseAssets = (release) => {
    if (selectedRelease === release) {
      setSelectedRelease(null);
    } else {
      setSelectedRelease(release);
    }
  };
    return (
      <Layout>
        <div className={styles.container}>


          <main className={styles.main}>
            <h1 className={styles.title}>Download Go+ Language</h1>
            <p className={styles.description}>
              Go+ is a superset language based on Go that provides additional features and enhancements.
              <br />Download the latest version below:


            </p>


            <h2>Featured downloads </h2>

            <div className={styles.download_wrapper}>
              <a href="https://github.com/goplus/gop/releases/download/v1.2.5/gop_v1.2.5_Windows_x86_64.zip" className={styles.download_box} >
                <h4 className={styles.download_box_title}>Windows</h4>
                <p className={styles.download_box_p}>适用机型: PC</p>
                <span className={styles.download_box_link}>下载链接</span>
              </a>

              {/* <a href="Source下载地址" className={styles.download_box}>
                <h4 className={styles.download_box_title}>iOS (arm64)</h4>
                <p className={styles.download_box_p}>适用机型: iPhone</p>
                <span  className={styles.download_box_link}>下载链接</span>
              </a>

              <a href="Source下载地址" className={styles.download_box}>
                <h4 className={styles.download_box_title}>iOS (x86)</h4>
                <p className={styles.download_box_p}>适用机型: iPhone Simulator</p>
                <span className={styles.download_box_link}>下载链接</span>
              </a> */}

              <a href="https://github.com/goplus/gop/releases/download/v1.2.5/gop_v1.2.5_Linux_arm64.tar.gz" className={styles.download_box}>
                <h4 className={styles.download_box_title}>Linux-arm64</h4>
                <p className={styles.download_box_p}>适用机型: Linux PC</p>
                <span className={styles.download_box_link}>下载链接</span>
              </a>

              <a href="https://github.com/goplus/gop/releases/download/v1.2.5/gop_v1.2.5_Linux_x86_64.tar.gz" className={styles.download_box}>
                <h4 className={styles.download_box_title}>Linux-x86</h4>
                <p className={styles.download_box_p}>适用机型: Linux PC</p>
                <span className={styles.download_box_link}>下载链接</span>
              </a>

              <a href="https://github.com/goplus/gop/archive/refs/tags/v1.2.5.tar.gz" className={styles.download_box}>
                <h4 className={styles.download_box_title}>Source</h4>
                <p className={styles.download_box_p}>适用机型: 所有平台</p>
                <span className={styles.download_box_link}>下载链接</span>
              </a>
            </div>

            <p>Get the latest version of <a href="https://github.com/goplus/gop" className={styles.link} target="_blank" rel="noopener noreferrer" >
              Go+
            </a> language from GitHub.</p>


            {/* <h2>Stable versions</h2>
            <GithubStableReleases /> */}
            <h2>Archived versions</h2>

            <div>
              <h5>GitHub Releases</h5>
              <ul>
                {releases.map((release) => (
                  <li key={release.id}>
                    <div onClick={() => toggleReleaseAssets(release)}>
                      {release.tag_name}
                    </div>
                    {selectedRelease === release && (
                      <ul>
                        {release.assets.map((asset) => (
                          <li key={asset.id}>
                            <a href={asset.browser_download_url} target="_blank" rel="noopener noreferrer">
                              {asset.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </main>
        </div>
      </Layout>
    )
}

export async function getServerSideProps  () {
  const response = await fetch('https://api.github.com/repos/goplus/gop/releases');

  console.log("ok")
  const data = await response.json();

  // Releases = data;


  // const releases = await getReleasesData();

  return {
    props: {
      releases: data
    }
    // revalidate: 600, // Regenerate page after 10 minutes
  }

}



