import React, { useState } from 'react'
import { NextApiRequest, NextApiResponse } from 'next'
import styles from 'pages/style.module.scss'
import Layout from 'components/Layout'
import ArrowDown from 'components/Icon/DownArrow'
import ArrowUp from 'components/Icon/UpArrow'

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
  tarball_url: string;
  zipball_url: string;
  body: string;
}
function createaUploader(): Uploader {
  return {
    login: "",
    id: 0,
    node_id: "",
    avatar_url: "",
    gravatar_id: "",
    url: "",
    html_url: "",
    followers_url: "",
    following_url: "",
    gists_url: "",
    starred_url: "",
    subscriptions_url: "",
    organizations_url: "",
    repos_url: "",
    events_url: "",
    received_events_url: "",
    type: "",
    site_admin: true,
  }
}

function createaAsset(): Asset {
  return {
    url: "",
    id: 0,
    node_id: "",
    name: "None",
    label: "",
    uploader: createaUploader(),
    content_type: "",
    state: "",
    size: 0,
    download_count: 0,
    created_at: "",
    updated_at: "",
    browser_download_url: ""
  }
}

function getFileSize(Size: number) {
  let size_str: string
  if (Size < 1024) {
    size_str = (Size.toFixed(2)).toString() + 'B'
  } else if (Size < (1024 * 1024)) {
    size_str = ((Size / 1024).toFixed(2)).toString() + 'KB'
  } else if (Size < (1024 * 1024 * 1024)) {
    size_str = ((Size / (1024 * 1024)).toFixed(2)).toString() + 'MB'
  } else {
    size_str = ((Size / (1024 * 1024 * 1024)).toFixed(2)).toString() + 'GB'
  }
  return size_str
}

function DownloadTable({ browser_download_url, name, Size }: { browser_download_url: string, name: string, Size: number }) {
  let fillContent = '', os = '', Arch = '', size_str = ''
  // Size = Size / 1024
  size_str = getFileSize(Size)



  if (name.endsWith(".src.tar.gz")) {
    fillContent = 'Source'
  }
  else if (name.endsWith(".zip") || name.endsWith(".tar.gz")) {
    fillContent = 'Archive'
  } else if (name.endsWith(".pkg") || name.endsWith(".msi")) {
    fillContent = 'Installer'
  } else {
    fillContent = ' '
  }

  if (name.includes("Linux") || name.includes("linux")) {
    os = 'Linux'
  } else if (name.includes("Windows") || name.includes("windows")) {
    os = 'Windows'
  } else if (name.includes("Darwin") || name.includes("darwin")) {
    os = 'macOS'
  }



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

  </>
  )
}

export const revalidate = 600 // Regenerate page after 10 minutes

export default function Home({ StableRelease, ArchivedReleases }: { StableRelease: GitHubRelease, ArchivedReleases: GitHubRelease[] }) {

  const [selectedRelease, setSelectedRelease] = useState(-1)
  const [isContentVisible, setContentVisible] = useState(true)

  const toggleContentVisibility = () => {
    setContentVisible(!isContentVisible)
  }

  const toggleReleaseAssets = (release: GitHubRelease) => {
    if (selectedRelease === release.id) {
      setSelectedRelease(-1)
    } else {
      setSelectedRelease(release.id)
    }
  }

  function getTarGz(assets: Asset[], os: string, arch: string) {
    let latestAsset
    if (os === "win") {
      latestAsset = assets.find(asset => ((asset.name).includes("win") || (asset.name).includes("Win")) && (asset.name).includes(arch) && (asset.name).includes(".zip"))
    }
    else if (os === "macOS") {
      latestAsset = assets.find(asset => ((asset.name).includes("darwin") || (asset.name).includes("Darwin")) && (asset.name).includes(arch) && (asset.name).includes(".tar.gz"))
    }
    else if (os === "linux") {
      latestAsset = assets.find(asset => ((asset.name).includes("linux") || (asset.name).includes("Linux")) && (asset.name).includes(arch) && (asset.name).includes(".tar.gz"))
    }
    if (latestAsset === undefined) {
      latestAsset = createaAsset()
    }
    return (latestAsset)
  }

  const latestWinAsset = getTarGz(StableRelease.assets, "win", "x86_64")        //Win's asset is .zip file.
  const latestMacOSx86Asset = getTarGz(StableRelease.assets, "macOS", "x86_64")
  const latestMacOSarmAsset = getTarGz(StableRelease.assets, "macOS", "arm")
  const latestLinuxarmAsset = getTarGz(StableRelease.assets, "linux", "arm")

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

            <a href={latestMacOSx86Asset.browser_download_url} className={styles.download_box}>
              <h4 className={styles.download_box_title}>Apple MacOS (X86_64)</h4>
              <p className={styles.download_box_p}>macOS 10.15 or later, Intel 64-bit processor</p>
              <span className={styles.download_box_link}>{latestMacOSx86Asset.name}</span>
            </a>

            <a href={latestMacOSarmAsset.browser_download_url} className={styles.download_box}>
              <h4 className={styles.download_box_title}>Apple MacOS (ARM64)</h4>
              <p className={styles.download_box_p}>macOS 11 or later, Apple 64-bit processor</p>
              <span className={styles.download_box_link}>{latestMacOSarmAsset.name}</span>
            </a>

            <a href={latestLinuxarmAsset.browser_download_url} className={styles.download_box}>
              <h4 className={styles.download_box_title}>Linux (ARM64)</h4>
              <p className={styles.download_box_p}>Linux 2.6.32 or later, Intel 64-bit processor</p>
              <span className={styles.download_box_link}>{latestLinuxarmAsset.name}</span>
            </a>
            {/* source code zipball_url */}
            <a href={StableRelease.zipball_url} className={styles.download_box} download={StableRelease.name+"_source_code.zip"}>
              <h4 className={styles.download_box_title}>Source code</h4>
              <p className={styles.download_box_p}>All</p>
              <span className={styles.download_box_link}> &quot.zip&quot file of source_code</span>
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
                {selectedRelease != StableRelease.id && (<ArrowDown />)}
                {selectedRelease === StableRelease.id && (<ArrowUp />)}
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
                      {/* ToDo */}
                      {/* <th>SHA256 Checksum</th> */}
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
                      < tr className={styles.table_hightlight} key={StableRelease.id}>

                        <td className={styles.filename}>
                          <a className={styles.link} href={StableRelease.zipball_url} download={StableRelease.name+"_source_code.zip"}>
                          &quot.zip&quot file of source_code
                          </a>
                        </td>
                        <td>Archive</td>
                        <td></td>
                        <td></td>
                        <td></td>


                      </tr>
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
              <ul className={styles.release_list}>
                {ArchivedReleases.map((release) => (

                  <li key={release.id}>
                    <div onClick={() => toggleReleaseAssets(release)} className={styles.release_item_name}>
                      <span>GoPlus_{release.tag_name}</span>
                      {selectedRelease != release.id && (<ArrowDown />)}
                      {selectedRelease === release.id && (<ArrowUp />)}
                    </div>
                    {selectedRelease === release.id && (
                      <ul className={styles.release_list}>
                        {release.assets.length === 0 && <table className={styles.downloadTable}>
                          <thead className={styles.downloadTable_header}>
                            <th>File name</th>
                            <th>Kind</th>
                            <th>OS</th>
                            <th>Arch</th>
                            <th>Size</th>
                            {/* ToDo */}
                            {/* <th>SHA256 Checksum</th> */}
                          </thead>
                          <tbody>
                            < tr className={styles.table_hightlight} key={release.id}>

                              <td className={styles.filename}>
                                <a className={styles.link} href={release.zipball_url} download="source_code.zip">
                                &quot.zip&quot file of source_code
                                </a>
                              </td>
                              <td>Archive</td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>}
                        {release.assets.length != 0 && <table className={styles.downloadTable}>
                          <thead className={styles.downloadTable_header}>
                            <th>File name</th>
                            <th>Kind</th>
                            <th>OS</th>
                            <th>Arch</th>
                            <th>Size</th>
                            {/* ToDo */}
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
                            < tr className={styles.table_hightlight} key={release.id}>

                              <td className={styles.filename}>
                                <a className={styles.link} href={release.zipball_url}>
                                &quot.zip&quot file of source_code
                                </a>
                              </td>
                              <td>Archive</td>
                              <td></td>
                              <td></td>
                              <td></td>


                            </tr>
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
    'public, s-maxage=600, stale-while-revalidate=60max'
  )

  const response = await fetch('https://api.github.com/repos/goplus/gop/releases',)
  let data: GitHubRelease[] = await response.json()
  const releases = data.filter(Release => !(Release.tag_name).includes("pre") && !(Release.tag_name).includes("beta") && !(Release.tag_name).includes("alpha") && !(Release.tag_name).includes("rc"))

  return {
    props: {
      StableRelease: releases[0],
      ArchivedReleases: releases.slice(1)
    }
  }

}



