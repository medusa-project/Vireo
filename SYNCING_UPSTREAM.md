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

The following branches from upstream are automatically synced to this repository:

### Version Branches (already existed in medusa-project/Vireo)
- `1.8.x`
- `1.9.x`
- `2.0.x`
- `3.0.x`
- `4.0.x`
- `main`

### Feature/Fix Branches (newly added from upstream)
- `2093-front_page_instructions_after` - Front page instructions feature
- `dependabot/maven/org.apache.tika-tika-core-3.2.2` - Dependency update
- `excel-export-extension` - Excel export functionality
- `log4j-fix` - Log4j security fix
- `main_proquest_sales_restriction` - ProQuest sales restriction feature
- `main_tomcat_108` - Tomcat 10.8 compatibility
- `primary-rename` - Primary branch rename
- `sprint-9-tests` - Sprint 9 test updates

## Tags

All tags from the upstream repository are synced. The most recent new tags include:

- `v4.3.2` - Latest release
- `v4.3.1` - Previous release

All historical tags (v1.8 through v4.3.0) were already present and remain synced.

## Notes

- The workflow uses `GITHUB_TOKEN` which has permissions to push to the repository
- Protected branches may require additional configuration
- If a branch already exists locally with different content, the push may fail
