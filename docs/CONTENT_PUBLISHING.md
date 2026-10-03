# Publishing courses and announcements

The public website reads `data/generated/admin-content.json`. It has no admin login, database connection, or access to account records. The file contains only approved public course and announcement fields.

This phase uses a manual release: publishing in admin updates the database; exporting and releasing the snapshot updates the website. Research resources are outside this exporter.

## Release a content update

1. In the admin, preview and publish the intended courses or announcements. Saving a draft keeps the previous published version live. Archived entries are excluded from exports.
2. In the admin checkout, with the intended database configured, run `npm run admin:publish:snapshot`. Do not use the test database for a real release.
3. In the public checkout, import that reviewed file:

   ```powershell
   npm run content:import -- 'D:\NEST club ( NSBM )\nest-lms-admin-phase1\data\generated\admin-content.json'
   ```

4. Review `git diff -- data/generated/admin-content.json`, then run `npm run check`. This validates public fields, curriculum routes and counts, links, assets, and the static build. Run the relevant browser checks for the affected pages.
5. Commit the reviewed snapshot to `main` and push it. The deployment rebuilds from that snapshot; the live site changes only after deployment succeeds.

The importer validates before replacing the existing file and writes it atomically. Every production build repeats content validation. Unknown fields, including draft payloads, account details, audit records, and learner progress, are rejected.

An empty announcement list removes all announcements and displays an empty state. This release requires at least one published course because the existing static curriculum routes need course data; an empty course export is rejected without replacing the current file. Keep this requirement in mind before archiving the final course.

The current video contract remains YouTube-based until the separately planned Google Drive migration. Website links in announcements must use site-relative paths or HTTP(S) URLs.

## Roll back

Revert the content release commit, run `npm run check`, and push the revert. This redeploys the previous snapshot without changing the admin database or its audit history.
