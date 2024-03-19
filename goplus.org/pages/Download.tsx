import React, { useState, useEffect, HTMLAttributes, SVGProps } from 'react';
import { NextApiRequest, NextApiResponse } from 'next';
import Head from 'next/head';
import styles from 'pages/style.module.scss';
import Layout from 'components/Layout';
import ButtonLogo from 'components/Icon/ButtonLogo'
import ButtonUpLogo from 'components/Icon/ButtonUpLogo'
// import { downloadTable as DownloadTableComponent } from 'components/DownloadTable';
// import GithubReleases, { GithubStableReleases } from './download/GithubReleases';

interface Author {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface Uploader {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface Asset {
  url: string,
  id: number,
  node_id: string,
  name: string,
  label: string,
  uploader: Uploader,
  content_type: string,
  state: string,
  size: number,
  download_count: number,
  created_at: string,
  updated_at: string,
  browser_download_url: string
}

interface GitHubRelease {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: Author;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: Asset[];
}




function DownloadTable({ browser_download_url, name, Size }: { browser_download_url: string, name: string, Size: number }) {
  let fillContent = '', os = '', Arch = '', size_str = '';
  // Size = Size / 1024
  if (Size < 1024) {
    size_str = (Size.toFixed(2)).toString() + 'B';
  } else if (Size < (1024 * 1024)) {
    size_str = ((Size / 1024).toFixed(2)).toString() + 'KB';
  } else if (Size < (1024 * 1024 * 1024)) {
    size_str = ((Size / (1024 * 1024)).toFixed(2)).toString() + 'MB';
  } else {
    size_str = ((Size / (1024 * 1024 * 1024)).toFixed(2)).toString() + 'GB';
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



  return (<>
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

  </>
  )
}




export default function Home({ StableRelease, ArchivedReleases }: { StableRelease: GitHubRelease, ArchivedReleases: GitHubRelease[] }) {

  const [selectedRelease, setSelectedRelease] = useState(-1);
  const [isContentVisible, setContentVisible] = useState(true);

  const toggleContentVisibility = () => {
    setContentVisible(!isContentVisible);
  };

  const toggleReleaseAssets = (release: GitHubRelease) => {
    if (selectedRelease === release.id) {
      setSelectedRelease(-1);
    } else {
      setSelectedRelease(release.id);
    }
  };

  const latestWinAsset = StableRelease.assets.filter(asset => ((asset.name).includes("win") || (asset.name).includes("Win")) && (asset.name).includes("x86_64") && (asset.name).includes(".zip"))[0]
  const latestIOSx86Asset = StableRelease.assets.filter(asset => ((asset.name).includes("darwin") || (asset.name).includes("Darwin")) && (asset.name).includes("x86_64") && (asset.name).includes(".tar.gz"))[0]
  const latestIOSarmAsset = StableRelease.assets.filter(asset => ((asset.name).includes("darwin") || (asset.name).includes("Darwin")) && (asset.name).includes("arm") && (asset.name).includes(".tar.gz"))[0]
  const latestLinuxarmAsset = StableRelease.assets.filter(asset => ((asset.name).includes("linux") || (asset.name).includes("Linux")) && (asset.name).includes("arm") && (asset.name).includes(".tar.gz"))[0]

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
              <span className={styles.download_box_link}>{latestIOSx86Asset.name}</span>
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
                {selectedRelease != StableRelease.id && (<ButtonLogo />)}
                {selectedRelease === StableRelease.id && (<ButtonUpLogo />)}
              </div>
              {selectedRelease === StableRelease.id && (
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
                        < tr className={styles.table_hightlight} key={asset.id}>
                          <DownloadTable

                            browser_download_url={asset.browser_download_url}
                            name={asset.name}
                            Size={asset.size}
                          />
                        </tr>

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
                      {selectedRelease != release.id && (<ButtonLogo />)}
                      {selectedRelease === release.id && (<ButtonUpLogo />)}
                    </div>
                    {selectedRelease === release.id && (
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
                            {release.assets.map((asset) => (< tr className={styles.table_hightlight} key={asset.id}>
                              <DownloadTable

                                browser_download_url={asset.browser_download_url}
                                name={asset.name}
                                Size={asset.size}
                              />
                            </tr>
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

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  const response = await fetch('https://api.github.com/repos/goplus/gop/releases');

  console.log("ok")
  let data: GitHubRelease[] = await response.json();
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



