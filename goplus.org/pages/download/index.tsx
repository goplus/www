import { useState } from "react"
import { NextApiRequest, NextApiResponse } from "next"
import styles from "./style.module.scss"
import Layout from "components/Layout"
import ArrowDown from "components/Icon/DownArrow"
import ArrowUp from "components/Icon/UpArrow"

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
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  uploader: Uploader;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
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

function createEmptyAsset(): Asset {
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
    browser_download_url: "",
  }
}

function getFileSize(Size: number) {
  let size_str: string
  if (Size < 1024) {
    size_str = Size.toFixed(2).toString() + "B"
  } else if (Size < 1024 * 1024) {
    size_str = (Size / 1024).toFixed(2).toString() + "KB"
  } else if (Size < 1024 * 1024 * 1024) {
    size_str = (Size / (1024 * 1024)).toFixed(2).toString() + "MB"
  } else {
    size_str = (Size / (1024 * 1024 * 1024)).toFixed(2).toString() + "GB"
  }
  return size_str
}

function DownloadTable({
  browser_download_url,
  name,
  Size,
}: {
  browser_download_url: string;
  name: string;
  Size: number;
}) {
  let fillContent = "",
    os = "",
    Arch = "",
    size_str = ""
  
  let splitTagName = name.split("_")
  let flag = 0
  let archAndPostfix = " .txt"
  if (splitTagName.length === 1) {
    splitTagName = name.split("-")
    flag = 1 
  }
  if (splitTagName.length>3){
    if (!flag){archAndPostfix = splitTagName.slice(3).join("_")}
    else {
      archAndPostfix = splitTagName.slice(3).join("-")
    }
    
  }
  let archAndPostfixList = archAndPostfix.split(".")
  Arch = archAndPostfixList[0]
  const postFix = archAndPostfixList.slice(1).join(".")

  size_str = getFileSize(Size)

  if (name.endsWith(".src.tar.gz")) {
    fillContent = "Source"
  } else if (name.endsWith(".zip") || name.endsWith(".tar.gz")) {
    fillContent = "Archive"
  } else {
    fillContent = " "
  }

  if (name.includes("Linux") || name.includes("linux")) {
    os = "Linux"
  } else if (name.includes("Windows") || name.includes("windows")) {
    os = "Windows"
  } else if (name.includes("Darwin") || name.includes("darwin")) {
    os = "macOS"
  }

  if (Arch.includes("386")) {
    Arch = "x86"
  }
  else if(Arch.includes("amd64") || Arch.includes("x86_64")){
    Arch = "x86-64"
  }
  else if(Arch.includes("arm") ){
    Arch = "ARM" + Arch.slice(3)
  }
  
  return (
    <>
      <td className={styles.filename}>
        <a className={styles.link} href={browser_download_url}>
          {name}
        </a>
      </td>
      <td>{fillContent}</td>
      <td>{os}</td>
      <td>{Arch}</td>
      <td>{size_str}</td>
    </>
  )
}

export default function Home({
  StableRelease,
  ArchivedReleases,
}: {
  StableRelease: GitHubRelease;
  ArchivedReleases: GitHubRelease[];
}) {
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

  function getTarGz(assets: Asset[], os: string, arch: string[]) {
    let latestAsset
    if (os === "win") {
      latestAsset = assets.find(
        (asset) =>
          (asset.name.includes("win") || asset.name.includes("Win")) &&
          arch.some(a => asset.name.includes(a)) &&
          asset.name.includes(".zip")
      )
    } else if (os === "macOS") {
      latestAsset = assets.find(
        (asset) =>
          (asset.name.includes("darwin") || asset.name.includes("Darwin")) &&
          arch.some(a => asset.name.includes(a)) &&
          asset.name.includes(".tar.gz")
      )
    } else if (os === "linux") {
      latestAsset = assets.find(
        (asset) =>
          (asset.name.includes("linux") || asset.name.includes("Linux")) &&
          arch.some(a => asset.name.includes(a)) &&
          asset.name.includes(".tar.gz")
      )
    }
    if (latestAsset === undefined) {
      latestAsset = createEmptyAsset()
    }
    return latestAsset
  }

  const latestWinAsset = getTarGz(StableRelease.assets, "win", ["x86_64", "amd64"]) //Win's asset is .zip file.
  const latestMacOSx86Asset = getTarGz(StableRelease.assets, "macOS", ["x86_64", "amd64"])
  const latestMacOSarmAsset = getTarGz(StableRelease.assets, "macOS", ["arm",])
  const latestLinuxX86Asset = getTarGz(StableRelease.assets, "linux", ["x86_64", "amd64"])

  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>All releases</h1>
        <p className={styles.description}>
          After downloading a binary release suitable for your system, please follow the&nbsp;
          <a
            href="https://github.com/goplus/gop?tab=readme-ov-file#how-to-install"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            installation instructions
          </a>. 
        </p>
        <p className={styles.description}>
        If you are building from source, you can also find instructions in the <a
            href="https://github.com/goplus/gop?tab=readme-ov-file#from-source-code"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            document
          </a>.
        </p>
        <p className={styles.description}>
        See the&nbsp;<a
            href="https://github.com/goplus/gop/releases"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            release history
          </a>&nbsp;for more information about XGo releases.
        </p>
        <h2 className={styles.titleH2}>Featured downloads</h2>

        <div className={styles.downloadWrapper}>
          <a
            href={latestWinAsset.browser_download_url}
            className={styles.downloadBox}
          >
            <h4 className={styles.downloadBoxTitle}>Microsoft Windows </h4>
            <p className={styles.downloadBoxP}>
              Windows, Intel 64-bit processor
            </p>
            <span className={styles.downloadBoxLink}>
              {latestWinAsset.name}
            </span>
          </a>

          <a
            href={latestMacOSx86Asset.browser_download_url}
            className={styles.downloadBox}
          >
            <h4 className={styles.downloadBoxTitle}>Apple macOS (x86-64)</h4>
            <p className={styles.downloadBoxP}>
              macOS, Intel 64-bit processor
            </p>
            <span className={styles.downloadBoxLink}>
              {latestMacOSx86Asset.name}
            </span>
          </a>

          <a
            href={latestMacOSarmAsset.browser_download_url}
            className={styles.downloadBox}
          >
            <h4 className={styles.downloadBoxTitle}>Apple macOS (ARM64)</h4>
            <p className={styles.downloadBoxP}>
              macOS, Apple 64-bit processor
            </p>
            <span className={styles.downloadBoxLink}>
              {latestMacOSarmAsset.name}
            </span>
          </a>

          <a
            href={latestLinuxX86Asset.browser_download_url}
            className={styles.downloadBox}
          >
            <h4 className={styles.downloadBoxTitle}>Linux (x86-64)</h4>
            <p className={styles.downloadBoxP}>
              Linux, Intel 64-bit processor
            </p>
            <span className={styles.downloadBoxLink}>
              {latestLinuxX86Asset.name}
            </span>
          </a>
          {/* source code zipball_url */}
          <a
            href={StableRelease.zipball_url}
            className={styles.downloadBox}
          >
            <h4 className={styles.downloadBoxTitle}>Source Code</h4>
            <p className={styles.downloadBoxP}>Requires go1.18 or later</p>
            <span className={styles.downloadBoxLink}>
              Download (zip)
            </span>
          </a>
        </div>
        <h2 className={styles.titleH2}>Stable versions</h2>
        <ul className={styles.releaseList}>
          <li key={StableRelease.id}>
            <h4
              onClick={() => toggleReleaseAssets(StableRelease)}
              className={styles.releaseItemName}
            >
              <span>{StableRelease.tag_name}</span>
              {selectedRelease != StableRelease.id && <ArrowDown />}
              {selectedRelease === StableRelease.id && <ArrowUp />}
            </h4>
            {selectedRelease === StableRelease.id && (
              <div className={styles.releaseAssetListDiv}>
                <table className={styles.downloadTable}>
                  <thead className={styles.downloadTableHeader}>
                    <tr>
                      <th className={styles.downloadTableHeaderName}>File name</th>
                      <th className={styles.downloadTableHeaderKind}>Kind</th>
                      <th className={styles.downloadTableHeaderOs}>OS</th>
                      <th className={styles.downloadTableHeaderArch}>Arch</th>
                      <th className={styles.downloadTableHeaderSize}>Size</th>
                      {/* ToDo */}
                      {/* <th>SHA256 Checksum</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {StableRelease.assets.map((asset) => (
                      <tr key={asset.id}>
                        <DownloadTable
                          browser_download_url={asset.browser_download_url}
                          name={asset.name}
                          Size={asset.size}
                        />
                      </tr>
                    ))}
                    <tr key={StableRelease.id}>
                      <td className={styles.filename}>
                        <a
                          className={styles.link}
                          href={StableRelease.zipball_url}
                        >
                          Source code (zip)
                        </a>
                      </td>
                      <td>Source</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>)}
          </li>
        </ul>
        <h2 onClick={toggleContentVisibility} className={styles.titleH2} style={{ cursor: "pointer" }}>
          Archived versions
          {isContentVisible && (
            <span className={styles.buttonLink}>Hide</span>
          )}
          {!isContentVisible && (
            <span className={styles.buttonLink}>Show</span>
          )}
        </h2>
        {isContentVisible && (
          <div>
            <ul className={styles.releaseList}>
              {ArchivedReleases.map((release) => (
                <li key={release.id}>
                  <h4
                    onClick={() => toggleReleaseAssets(release)}
                    className={styles.releaseItemName}
                  >
                    <span>{release.tag_name}</span>
                    {selectedRelease != release.id && <ArrowDown />}
                    {selectedRelease === release.id && <ArrowUp />}
                  </h4>
                  {selectedRelease === release.id && (
                    <div className={styles.releaseAssetListDiv}>
                      {release.assets.length === 0 && (
                        <table className={styles.downloadTable}>
                          <thead className={styles.downloadTableHeader}>
                            <tr>
                              <th className={styles.downloadTableHeaderName}>File name</th>
                              <th className={styles.downloadTableHeaderKind}>Kind</th>
                              <th className={styles.downloadTableHeaderOs}>OS</th>
                              <th className={styles.downloadTableHeaderArch}>Arch</th>
                              <th className={styles.downloadTableHeaderSize}>Size</th>
                              {/* ToDo */}
                              {/* <th>SHA256 Checksum</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            <tr key={release.id}>
                              <td className={styles.filename}>
                                <a
                                  className={styles.link}
                                  href={release.zipball_url}
                                  download="source_code.zip"
                                >
                                  Source code (zip)
                                </a>
                              </td>
                              <td>Source</td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                      {release.assets.length != 0 && (
                        <table className={styles.downloadTable}>
                          <thead className={styles.downloadTableHeader}>
                            <tr>
                              <th className={styles.downloadTableHeaderName}>File name</th>
                              <th className={styles.downloadTableHeaderKind}>Kind</th>
                              <th className={styles.downloadTableHeaderOs}>OS</th>
                              <th className={styles.downloadTableHeaderArch}>Arch</th>
                              <th className={styles.downloadTableHeaderSize}>Size</th>
                              {/* ToDo */}
                              {/* <th>SHA256 Checksum</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {release.assets.map((asset) => (
                              <tr key={asset.id}>
                                <DownloadTable
                                  browser_download_url={
                                    asset.browser_download_url
                                  }
                                  name={asset.name}
                                  Size={asset.size}
                                />
                              </tr>
                            ))}
                            <tr key={release.id}>
                              <td className={styles.filename}>
                                <a
                                  className={styles.link}
                                  href={release.zipball_url}
                                >
                                  Source code (zip)
                                </a>
                              </td>
                              <td>Source</td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </Layout>
  )
}

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=60max"
  )
  const response = await fetch(
    "https://api.github.com/repos/goplus/gop/releases"
  )
  let data: GitHubRelease[] = await response.json()
  const releases = data.filter((Release) => {
    const splitTagName = Release.tag_name.split("-")
    const splitLength = splitTagName.length
    if (
      splitLength === 1 ||
      (splitLength === 2 &&
        (!splitTagName[1].includes("pre") &&
          !splitTagName[1].includes("beta") &&
          !splitTagName[1].includes("alpha") &&
          !splitTagName[1].includes("rc")))
    ) {
      return true
    }
    return false
  })

  return {
    props: {
      StableRelease: releases[0],
      ArchivedReleases: releases.slice(1),
    },
  }
}
