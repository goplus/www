import React, { useState, useEffect, HTMLAttributes, SVGProps } from 'react';
import Head from 'next/head';
import styles from 'pages/style.module.scss';
import Layout from 'components/Layout';
import { ButtonLogo as Logo } from 'components/Icon/ButtonLogo'
import ButtonLogo from 'components/Icon/ButtonLogo'
import ButtonUpLogo from 'components/Icon/ButtonUpLogo'
// import { downloadTable as DownloadTableComponent } from 'components/DownloadTable';
// import GithubReleases, { GithubStableReleases } from './download/GithubReleases';


function DownloadTable({ browser_download_url, name, Size }) {
  let fillContent = '', os = '', Arch = '', size_str = '';
  // Size = Size / 1024
  if (Size < 1024) {
    size_str = (Size.toFixed(2)).toString() + 'B';
  } else if (Size < (1024 * 1024)) {
    size_str = ((Size / 1024).toFixed(2)).toString() + 'KB';
  } else if (Size < (1024 * 1024 * 1024)) {
    size_str = ((Size / (1024 * 1024)).toFixed(2)).toString() + 'MB';
  } else {
    size_str = ((Size / (1024 * 1024 * 1024).toFixed(2))).toString() + 'GB';
  }



  if (name.endsWith(".src.tar.gz")) {
    fillContent = 'Source';
  }
  else if (name.endsWith(".zip") || name.endsWith(".tar.gz")) {
    fillContent = 'Archive';
  } else if (name.endsWith(".pkg") || name.endsWith(".msi")) {
    fillContent = 'Installer';
  } else {
    fillContent = ' ';
  }

  if (name.includes("Linux")) {
    os = 'Linux';
  } else if (name.includes("Windows")) {
    os = 'Windows';
  } else if (name.includes("Darwin")) {
    os = 'macOS';
  }

  // if (name.includes("Linux")) {
  //   Arch = 'Linux';
  // } else if (name.includes("Windows")) {
  //   Arch = 'Windows';
  // } else if (name.includes("Darwin")){
  //   Arch = 'macOS';
  // }



  return (<tr className={styles.table_hightlight}>
    <td className={styles.filename}>
      <a className={styles.link} href={browser_download_url}>
        {name}
      </a>
    </td>
    <td>
      {fillContent}
    </td>
    <td>
      {os}
    </td>
    <td>
      {Arch}
    </td>
    <td>
      {size_str}
    </td>
    {/* <td>
      {Checksum}
    </td> */}

  </tr>
  )
}


export default function Home({ releases }) {

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
              <p className={styles.download_box_p}>Windows 10 or later, Intel 64-bit processor</p>
              <span className={styles.download_box_link}>gop_v1.2.5_Windows_x86_64.zip</span>
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
              <p className={styles.download_box_p}>Linux 2.6.32 or later, Intel 64-bit processor</p>
              <span className={styles.download_box_link}>gop_v1.2.5_Linux_arm64.tar.gz</span>
            </a>

            <a href="https://github.com/goplus/gop/releases/download/v1.2.5/gop_v1.2.5_Linux_x86_64.tar.gz" className={styles.download_box}>
              <h4 className={styles.download_box_title}>Linux-x86</h4>
              <p className={styles.download_box_p}>Linux 2.6.32 or later, Intel 64-bit processor</p>
              <span className={styles.download_box_link}>gop_v1.2.5_Linux_x86_64.tar.gz</span>
            </a>

            <a href="https://github.com/goplus/gop/archive/refs/tags/v1.2.5.tar.gz" className={styles.download_box}>
              <h4 className={styles.download_box_title}>Source</h4>
              <p className={styles.download_box_p}>All</p>
              <span className={styles.download_box_link}>v1.2.5.tar.gz</span>
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
            <ul className={styles.release_list}>
              {releases.map((release) => (
                <li key={release.id}>
                  <div onClick={() => toggleReleaseAssets(release)} className={styles.release_item_name}>
                    <span>GoPlus_{release.tag_name}</span>
                    {selectedRelease != release && (<ButtonLogo />)}
                    {selectedRelease === release && (<ButtonUpLogo />)}
                  </div>
                  {selectedRelease === release && (
                    <ul className={styles.release_list}>
                      <table className={styles.downloadTable}>
                        <thead className={styles.downloadTable_header}>
                          <th>File name</th>
                          <th>Kind</th>
                          <th>OS</th>
                          <th>Arch</th>
                          <th>Size</th>
                          <th>SHA256 Checksum</th>
                        </thead>
                        <tbody>


                          {release.assets.map((asset) => (
                            // <li key={asset.id}>
                            //   <a href={asset.browser_download_url} target="_blank" rel="noopener noreferrer">
                            //     {asset.name}
                            //   </a>
                            // </li>


                            <DownloadTable
                              // id={asset.id} 
                              browser_download_url={asset.browser_download_url}
                              name={asset.name}
                              Size={asset.size}
                            />
                            // <tr className={styles.table_hightlight}>
                            //     <td className={styles.filename}>
                            //         <a class={styles.link} href={asset.browser_download_url}>
                            //         {asset.name}
                            //         </a>
                            //     </td>
                            //     <td>
                            //       123123
                            //     </td>

                            // </tr>



                          ))}
                        </tbody>
                      </table>
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

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

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



