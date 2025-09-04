'use client';

export function ViewSiteLink() {
  return (
    <a href={window.location.origin} target="_blank" style={{ textDecoration: 'none' }}>
      {window.location.origin}
    </a>
  );
}
