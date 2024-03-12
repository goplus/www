import React, { useState, useEffect } from 'react';


export function GithubStableReleases(){
  const [releases, setReleases] = useState([]);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const toggleReleaseAssets = (release) => {
    if (selectedRelease === release) {
      setSelectedRelease(null);
    } else {
      setSelectedRelease(release);
    }
  };

  useEffect(() => {
    const stableVersionLink = 'http://localhost:3001/github/repos/goplus/gop/releases/tag/v1.2.5';
      // 'http://localhost:3001/github/repos/goplus/gop/releases/tag/v1.2.5'
    const fetchReleases = async (link) => {
      try {
        const response = await fetch(link);
        if (response.ok) {
          const data = await response.json();
          setReleases(data);
        } else {
          console.error('Failed to fetch releases');
        }
      } catch (error) {
        console.error('Error fetching releases:', error);
      }
    };

    fetchReleases(stableVersionLink);

    // Optionally, you can set up a timer to fetch releases periodically
    const timer = setInterval(fetchReleases, 6000); // Fetch every 1 minute

    // Remember to clean up the timer if the component unmounts
    return () => {
      clearInterval(timer); // Clean up the timer when the component unmounts
    };
  }, []);


  return (
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
  );


};



export default function GithubReleases(){
  const [releases, setReleases] = useState([]);

  const [selectedRelease, setSelectedRelease] = useState(null);
  const toggleReleaseAssets = (release) => {
    if (selectedRelease === release) {
      setSelectedRelease(null);
    } else {
      setSelectedRelease(release);
    }
  };

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch('http://localhost:3001/github/repos/goplus/gop/releases');
        if (response.ok) {
          const data = await response.json();
          setReleases(data);
        } else {
          console.error('Failed to fetch releases');
        }
      } catch (error) {
        console.error('Error fetching releases:', error);
      }
    };

    fetchReleases();

    // Optionally, you can set up a timer to fetch releases periodically
    const timer = setInterval(fetchReleases, 6000); // Fetch every 1 minute

    // Remember to clean up the timer if the component unmounts
    return () => {
      clearInterval(timer); // Clean up the timer when the component unmounts
    };
  }, []);

  return (
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
  );
};