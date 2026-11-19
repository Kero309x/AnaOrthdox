# Next actions for the foundation branch

1. Review the primary frontend/backend foundation diff and approve the branch commit and draft PR before any account write.
2. Run the proposed CI against the branch. Real PostgreSQL18 migration and auth smoke are not locally verified. Fix any failures before merge.
3. Review screenshots and legacy redirects against the delivered frontend. Test compass on real hardware and assess accessibility with users.
4. Plan authentication and API adapters against existing DTOs without fetching directly inside UI components. Decide PWA/offline behavior explicitly.
5. Establish church review and rights for each content source before import or user-facing claims. Do not treat old status/source labels as proof.
6. Plan baselining/backups separately for any existing populated database. Do not reset valuable data or silently change an existing Docker volume.
7. Merge/deploy only after a separate explicit decision. No paid service or repository settings change is part of this branch.
