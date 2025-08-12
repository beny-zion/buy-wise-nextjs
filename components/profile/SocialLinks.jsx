/* needed */
import React from 'react';

const SocialLinks = ({ social }) => (
  <div className="flex gap-4 mt-4">
    {Object.entries(social || {}).map(([platform, url]) => (
      url && (
        <a 
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {platform}
        </a>
      )
    ))}
  </div>
);

export default SocialLinks;