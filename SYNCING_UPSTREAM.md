# Syncing Upstream Branches and Tags

This repository is a fork of [TexasDigitalLibrary/Vireo](https://github.com/TexasDigitalLibrary/Vireo). To keep branches and tags synchronized with the upstream repository, you can use either the automated workflow or manual commands.

## Automated Sync

A GitHub Actions workflow (`.github/workflows/sync-upstream.yml`) has been configured to automatically sync upstream branches and tags:

- **Manual trigger**: Go to [Actions → Sync Upstream Branches and Tags → Run workflow](../../actions/workflows/sync-upstream.yml)
- **Automatic sync**: Runs weekly on Monday at 00:00 UTC

### First Time Setup

After merging this PR, you should manually trigger the workflow once to sync all existing branches and tags from upstream:

1. Go to the [Actions tab](../../actions)
2. Click on "Sync Upstream Branches and Tags" workflow
3. Click "Run workflow" button
4. Click the green "Run workflow" button to confirm

## Manual Sync

If you need to manually sync branches and tags, follow these steps:

### 1. Add upstream remote (if not already added)

```bash
git remote add upstream https://github.com/TexasDigitalLibrary/Vireo.git
```

### 2. Fetch all branches and tags from upstream

```bash
git fetch upstream --tags
git fetch upstream
```

### 3. Push specific branches to origin

To push individual branches from upstream:

```bash
# Replace BRANCH_NAME with the actual branch name
git push origin upstream/BRANCH_NAME:refs/heads/BRANCH_NAME
```

Or to push multiple branches at once:

```bash
git push origin \
  upstream/2093-front_page_instructions_after:refs/heads/2093-front_page_instructions_after \
  upstream/dependabot/maven/org.apache.tika-tika-core-3.2.2:refs/heads/dependabot/maven/org.apache.tika-tika-core-3.2.2 \
  upstream/excel-export-extension:refs/heads/excel-export-extension \
  upstream/log4j-fix:refs/heads/log4j-fix \
  upstream/main_proquest_sales_restriction:refs/heads/main_proquest_sales_restriction \
  upstream/main_tomcat_108:refs/heads/main_tomcat_108 \
  upstream/primary-rename:refs/heads/primary-rename \
  upstream/sprint-9-tests:refs/heads/sprint-9-tests
```

### 4. Push all tags to origin

```bash
git push origin --tags
```

## Currently Synced Branches

The following branches from upstream are automatically synced:

- `2093-front_page_instructions_after`
- `dependabot/maven/org.apache.tika-tika-core-3.2.2`
- `excel-export-extension`
- `log4j-fix`
- `main_proquest_sales_restriction`
- `main_tomcat_108`
- `primary-rename`
- `sprint-9-tests`

## Tags

All tags from the upstream repository are synced, including version tags like `v4.3.2`, `v4.3.1`, etc.

## Notes

- The workflow uses `GITHUB_TOKEN` which has permissions to push to the repository
- Protected branches may require additional configuration
- If a branch already exists locally with different content, the push may fail
