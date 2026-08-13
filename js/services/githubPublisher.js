/**
 * githubPublisher.js — GitHub Pages Publishing Service (Placeholder)
 *
 * This module defines the interface for future GitHub API integration.
 * Currently not implemented — export ZIP and upload manually.
 *
 * Future implementation will:
 * - Create a GitHub repository via GitHub REST API
 * - Upload index.html, menu.json, and assets/ via GitHub API (base64 encoded)
 * - Enable GitHub Pages in repository settings
 * - Return the public Pages URL
 *
 * Required scopes: repo, pages
 */

window.GitHubPublisher = (() => {

  /**
   * Publish a menu to GitHub Pages
   *
   * @param {object} menuData - The menu data object
   * @param {string} token - GitHub Personal Access Token
   * @param {string} repoName - Repository name (e.g. 'my-menu')
   * @param {string} username - GitHub username
   * @returns {Promise<{url: string, repoName: string, pagesUrl: string}>}
   *
   * @throws {Error} Not yet implemented
   */
  async function publishToGitHub(menuData, token, repoName, username) {
    throw new Error(
      'GitHub publishing is not yet implemented in V1. ' +
      'Please export the ZIP file and upload it to GitHub manually. ' +
      'See the QR Code panel for step-by-step instructions.'
    );
  }

  return {
    publishToGitHub,
    isImplemented: false,
    version: '1.0.0-placeholder'
  };
})();
