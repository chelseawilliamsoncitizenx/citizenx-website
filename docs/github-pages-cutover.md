# CitizenX GitHub Pages production cutover

This repository is prepared to export the Next.js website as static files and deploy them to GitHub Pages. The workflow is in `.github/workflows/deploy-pages.yml`; the generated website is uploaded from `out/`.

## Why this option fits

- The current CitizenX frontend is a static Next.js export and does not require a Node.js server at runtime.
- GitHub Pages is available at no hosting cost for public repositories on GitHub Free.
- The apex domain `citizenx.fund` can be connected and protected with HTTPS.
- GitHub Actions provides a repeatable build and deployment trail from `main`.

GitHub Pages does not provide a server-side form handler, database, shared sandbox state or payment processing. Those capabilities will need separate, production-grade services before real campaigns or payments are enabled.

## Access needed before launch

1. Administrator access to the intended GitHub repository or organisation.
2. Access to the DNS provider that controls `citizenx.fund`.
3. A record of the current DNS settings and the ability to restore them during rollback.
4. Confirmation that the repository may be public. GitHub Free Pages for private repositories is not included in the free plan.

## Safe cutover sequence

1. Create or select the production GitHub repository and add it as this workspace's `origin` remote.
2. Push the reviewed `main` branch.
3. In **Settings → Pages**, choose **GitHub Actions** as the publishing source.
4. Run the deployment workflow and validate the temporary `github.io` address before changing public DNS.
5. Verify ownership of `citizenx.fund` in the GitHub organisation or account.
6. Add `citizenx.fund` as the custom domain in GitHub Pages **before** changing DNS. This reduces domain-takeover risk.
7. Following GitHub's current custom-domain instructions, update the apex DNS records at the domain provider. Do not delete unrelated mail records such as MX, SPF, DKIM or DMARC.
8. Wait for GitHub's DNS check to pass, then enable **Enforce HTTPS**.
9. Test the production domain on desktop and mobile, including navigation, contribution demo, public audits, supplier workflows, contact links and accessibility basics.
10. Keep the prior hosting configuration available until the DNS change and HTTPS certificate are stable.

## Rollback

If the new website or certificate fails after cutover, restore only the previous website DNS records from the pre-cutover snapshot. Do not change email-related DNS. The GitHub deployment can remain available at its `github.io` address for diagnosis.

## Contact handling

The public founding-network form prepares an email to `hello@citizenx.fund` and provides a copy-to-clipboard fallback. It deliberately stores no personal information on the static website. If CitizenX later wants a form that sends without opening the visitor's email application, select a POPIA-appropriate form or API provider, publish the relevant privacy disclosure, and keep its credentials outside the browser bundle.

## Official references

- [Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Managing a custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Securing a GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
