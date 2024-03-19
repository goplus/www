import React, { useState, useEffect, HTMLAttributes, SVGProps } from 'react';
import Head from 'next/head';
import styles from 'pages/style.module.scss';
import Layout from 'components/Layout';
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

  if (name.includes("Linux") || name.includes("linux")) {
    os = 'Linux';
  } else if (name.includes("Windows") || name.includes("windows")) {
    os = 'Windows';
  } else if (name.includes("Darwin") || name.includes("darwin")) {
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




export default function Home({ StableRelease, ArchivedReleases }) {

  const [selectedRelease, setSelectedRelease] = useState(null);
  const [isContentVisible, setContentVisible] = useState(true);

  const toggleContentVisibility = () => {
    setContentVisible(!isContentVisible);
  };

  const toggleReleaseAssets = (release) => {
    if (selectedRelease === release) {
      setSelectedRelease(null);
    } else {
      setSelectedRelease(release);
    }
  };

  const latestWinAsset = StableRelease.assets.filter(asset => ((asset.name).includes("win") || (asset.name).includes("Win")) && (asset.name).includes("x86_64") && (asset.name).includes(".zip"))[0]
  const latestIOSx86Asset = StableRelease.assets.filter(asset => ((asset.name).includes("darwin") || (asset.name).includes("Darwin")) && (asset.name).includes("x86_64") && (asset.name).includes(".tar.gz"))[0]
  const latestIOSarmAsset = StableRelease.assets.filter(asset => ((asset.name).includes("darwin") || (asset.name).includes("Darwin")) && (asset.name).includes("arm") && (asset.name).includes(".tar.gz"))[0]
  const latestLinuxarmAsset = StableRelease.assets.filter(asset =>( (asset.name).includes("linux") || (asset.name).includes("Linux")) && (asset.name).includes("arm") && (asset.name).includes(".tar.gz"))[0]

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
            <a href={latestWinAsset.browser_download_url} className={styles.download_box} >
              <h4 className={styles.download_box_title}>Microsoft Windows</h4>
              <p className={styles.download_box_p}>Windows 10 or later, Intel 64-bit processor</p>
              <span className={styles.download_box_link}>{latestWinAsset.name}</span>
            </a>

            <a href={latestIOSx86Asset.browser_download_url} className={styles.download_box}>
                <h4 className={styles.download_box_title}>Apple MacOS (X86_64)</h4>
                <p className={styles.download_box_p}>macOS 10.15 or later, Intel 64-bit processor</p>
                <span  className={styles.download_box_link}>{latestIOSx86Asset.name}</span>
              </a>

              <a href={latestIOSarmAsset.browser_download_url} className={styles.download_box}>
                <h4 className={styles.download_box_title}>Apple MacOS (ARM64)</h4>
                <p className={styles.download_box_p}>macOS 11 or later, Apple 64-bit processor</p>
                <span className={styles.download_box_link}>{latestIOSarmAsset.name}</span>
              </a>

            <a href={latestLinuxarmAsset.browser_download_url} className={styles.download_box}>
              <h4 className={styles.download_box_title}>Linux (ARM64)</h4>
              <p className={styles.download_box_p}>Linux 2.6.32 or later, Intel 64-bit processor</p>
              <span className={styles.download_box_link}>{latestLinuxarmAsset.name}</span>
            </a>

          </div>

          <p>Get the latest version of <a href="https://github.com/goplus/gop" className={styles.link} target="_blank" rel="noopener noreferrer" >
            Go+
          </a> language from GitHub.</p>


          <h2>Stable versions</h2>
          <ul className={styles.release_list}>
            <li key={StableRelease.id}>
              <div onClick={() => toggleReleaseAssets(StableRelease)} className={styles.release_item_name}>
                <span>GoPlus_{StableRelease.tag_name}</span>
                {selectedRelease != StableRelease && (<ButtonLogo />)}
                {selectedRelease === StableRelease && (<ButtonUpLogo />)}
              </div>
              {selectedRelease === StableRelease && (
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
                      {StableRelease.assets.map((asset) => (
                        <DownloadTable
                          browser_download_url={asset.browser_download_url}
                          name={asset.name}
                          Size={asset.size}
                        />
                      ))}
                    </tbody>
                  </table>
                </ul>
              )}
            </li>
          </ul>
          <h2 onClick={toggleContentVisibility} style={{ cursor: 'pointer' }}>Archived versions
            {isContentVisible && (<span className={styles.buttonlink}>Hide</span>)}
            {!isContentVisible && (<span className={styles.buttonlink}>Show</span>)}
          </h2>
          {isContentVisible && (
            <div>
              <h5>GitHub Releases</h5>
              <ul className={styles.release_list}>
                {ArchivedReleases.map((release) => (

                  <li key={release.id}>
                    <div onClick={() => toggleReleaseAssets(release)} className={styles.release_item_name}>
                      <span>GoPlus_{release.tag_name}</span>
                      {selectedRelease != release && (<ButtonLogo />)}
                      {selectedRelease === release && (<ButtonUpLogo />)}
                    </div>
                    {selectedRelease === release && (
                      <ul className={styles.release_list}>
                        {release.assets.length === 0 && <span className={styles.release_span}>No content available now !</span>}
                        {release.assets.length != 0 && <table className={styles.downloadTable}>
                          <thead className={styles.downloadTable_header}>
                            <th>File name</th>
                            <th>Kind</th>
                            <th>OS</th>
                            <th>Arch</th>
                            <th>Size</th>
                            {/* <th>SHA256 Checksum</th> */}
                          </thead>
                          <tbody>
                            {release.assets.map((asset) => (
                              <DownloadTable
                                browser_download_url={asset.browser_download_url}
                                name={asset.name}
                                Size={asset.size}
                              />
                            ))}
                          </tbody>
                        </table>}

                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>)}

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
  let data = await response.json();
  const releases = data.filter(Release => !(Release.tag_name).includes("pre") && !(Release.tag_name).includes("beta") && !(Release.tag_name).includes("alpha") && !(Release.tag_name).includes("rc"))
  // Releases = data;


  // const releases = await getReleasesData();

  return {
    props: {
      StableRelease: releases[0],
      ArchivedReleases: releases.slice(1)
    }
    // revalidate: 600, // Regenerate page after 10 minutes
  }

}



