import type { NewTask, PERTTaskResult, Project } from '@/types'
import { calculateExpectedTime } from '@/utils/calculateExpectedTime'
import { calculateStandardDeviation } from '@/utils/calculateStandardDeviation'
import { calculateVariance } from '@/utils/calculateVariance'

export const DEMO_SEED_KEY = 'man-hours-demo-seed-version'
export const DEMO_SEED_VERSION = '2'

function task(
  milestone: string,
  taskName: string,
  description: string,
  optimistic: number,
  mostLikely: number,
  pessimistic: number,
): PERTTaskResult {
  const estimate: NewTask = {
    milestone,
    taskName,
    description,
    optimistic,
    mostLikely,
    pessimistic,
  }
  const standardDeviation = calculateStandardDeviation(estimate)

  return {
    ...estimate,
    expectedTime: calculateExpectedTime(estimate),
    standardDeviation,
    variance: calculateVariance(standardDeviation),
  }
}

function project(
  id: string,
  name: string,
  pinned: boolean,
  createdAt: string,
  updatedAt: string,
  targetDuration: number,
  tasks: PERTTaskResult[],
): Project {
  return {
    id,
    name,
    pinned,
    createdAt,
    updatedAt,
    state: {
      tasks,
      targetDuration,
      targetDurationEdited: true,
      retainMilestone: false,
      deleteWarning: true,
      resetWarning: true,
    },
  }
}

export const DEMO_PROJECTS: Project[] = [
  project(
    'demo-mobile-banking',
    'Mobile Banking App — MVP',
    true,
    '2026-10-27T09:15:00.000Z',
    '2026-11-19T16:42:00.000Z',
    220,
    [
      task('Discovery', 'Stakeholder interviews', 'Align product, compliance, and support teams on MVP scope.', 4, 6, 10),
      task('Discovery', 'Requirements & scope', 'Document account, payments, and onboarding requirements.', 6, 10, 18),
      task('Design', 'Wireframes', 'Low-fidelity flows for onboarding, dashboard, and payments.', 8, 12, 20),
      task('Design', 'Design system', 'Shared components, typography, and color tokens.', 10, 16, 28),
      task('Implementation', 'Auth & onboarding', 'Sign-up, KYC hand-off, biometric login, and session handling.', 16, 24, 40),
      task('Implementation', 'Account dashboard', 'Balances, transaction history, and account switching.', 20, 30, 50),
      task('Implementation', 'Payments flow', 'Transfers, payees, confirmation, and receipt states.', 24, 36, 60),
      task('Implementation', 'Notifications', 'Push notifications for transfers and security events.', 8, 12, 24),
      task('QA', 'Test plan', 'Coverage matrix for critical flows and edge cases.', 6, 10, 16),
      task('QA', 'Regression testing', 'Full regression pass across supported devices.', 12, 18, 30),
      task('QA', 'UAT', 'Business acceptance with pilot customers.', 8, 14, 24),
      task('QA', 'Launch support', 'Store submission, monitoring, and hotfix window.', 4, 8, 16),
    ],
  ),
  project(
    'demo-admin-dashboard',
    'Internal Admin Dashboard',
    false,
    '2026-11-03T11:05:00.000Z',
    '2026-11-17T10:20:00.000Z',
    94,
    [
      task('Audit', 'Component audit', 'Inventory existing widgets and flag reuse candidates.', 4, 6, 10),
      task('Backend', 'API integration', 'Wire dashboard reads and writes to the internal API.', 12, 18, 30),
      task('Backend', 'Role management', 'Admin, editor, and read-only permission tiers.', 8, 12, 20),
      task('Frontend', 'Data tables', 'Sortable, filterable tables with bulk actions.', 10, 16, 28),
      task('Frontend', 'Charts & reporting', 'Usage charts with date-range comparison.', 14, 20, 36),
      task('QA', 'Testing', 'Permission matrix and data integrity checks.', 8, 12, 20),
      task('Release', 'Deployment', 'Staging rollout, smoke tests, and production cutover.', 4, 6, 10),
    ],
  ),
  project(
    'demo-marketing-site',
    'Marketing Site Redesign',
    false,
    '2026-10-12T08:30:00.000Z',
    '2026-11-11T14:08:00.000Z',
    89,
    [
      task('Content', 'Content strategy', 'Message hierarchy and page-by-page narrative.', 6, 8, 14),
      task('Content', 'Copywriting', 'Landing, pricing, and about page copy.', 8, 12, 20),
      task('Design', 'Visual design', 'New visual direction and responsive layouts.', 10, 14, 24),
      task('Build', 'Frontend build', 'Responsive implementation of all templates.', 16, 24, 40),
      task('Build', 'CMS setup', 'Editable sections, media handling, and previews.', 6, 10, 18),
      task('Launch', 'SEO & analytics', 'Metadata, sitemap, redirects, and event tracking.', 4, 6, 12),
    ],
  ),
  project(
    'demo-payments-api',
    'Payments API v2',
    true,
    '2026-10-30T10:10:00.000Z',
    '2026-11-20T09:35:00.000Z',
    100,
    [
      task('Design', 'API contract & versioning', 'Define v2 resources, error shapes, and deprecation policy.', 6, 8, 14),
      task('Build', 'Idempotency & retries', 'Safe retries for charges, refunds, and payout operations.', 8, 12, 20),
      task('Build', 'Webhook delivery', 'Signed webhooks with backoff and replay support.', 10, 16, 28),
      task('Build', 'Rate limiting', 'Per-merchant quotas and burst handling.', 6, 10, 16),
      task('Security', 'PCI review', 'Threat model review and remediation sign-off.', 8, 12, 18),
      task('Security', 'Load testing', 'Peak traffic and failure-mode testing.', 6, 10, 18),
      task('Release', 'SDK updates', 'Publish updated server and client SDKs.', 8, 12, 20),
      task('Release', 'Canary rollout', 'Progressive rollout with automatic rollback.', 4, 8, 14),
    ],
  ),
  project(
    'demo-customer-portal',
    'Customer Portal Rebuild',
    true,
    '2026-10-20T13:45:00.000Z',
    '2026-11-18T15:12:00.000Z',
    97,
    [
      task('Discovery', 'Discovery workshops', 'Align support, billing, and success teams on priorities.', 4, 6, 10),
      task('Design', 'IA & flows', 'Navigation model and end-to-end account journeys.', 6, 10, 16),
      task('Design', 'UI redesign', 'Refreshed visual direction across all portal screens.', 10, 16, 26),
      task('Build', 'Frontend rebuild', 'Component-driven rebuild with accessibility support.', 20, 30, 48),
      task('Build', 'Billing integration', 'Invoices, payment methods, and plan changes.', 8, 12, 20),
      task('Launch', 'UAT & launch', 'Customer acceptance, migration, and launch support.', 6, 10, 18),
    ],
  ),
  project(
    'demo-design-system',
    'Design System v2',
    false,
    '2026-10-24T09:00:00.000Z',
    '2026-11-20T11:26:00.000Z',
    59,
    [
      task('Audit', 'Component audit', 'Inventory current components and identify duplication.', 4, 6, 10),
      task('Foundations', 'Token architecture', 'Color, spacing, type, and elevation tokens.', 6, 10, 16),
      task('Build', 'Core components', 'Buttons, inputs, dialogs, tables, and navigation.', 12, 18, 30),
      task('Build', 'Documentation', 'Usage guidance and live examples for each component.', 6, 10, 18),
      task('Adoption', 'Adoption support', 'Migration plan and pairing with product teams.', 6, 8, 14),
    ],
  ),
  project(
    'demo-data-migration',
    'Data Migration to Postgres',
    false,
    '2026-10-08T07:40:00.000Z',
    '2026-11-16T12:02:00.000Z',
    76,
    [
      task('Planning', 'Schema mapping', 'Map legacy tables and define target constraints.', 8, 12, 20),
      task('Build', 'Migration scripts', 'Backfill jobs with restart and verification hooks.', 14, 20, 34),
      task('Cutover', 'Dual-write window', 'Run old and new stores in parallel safely.', 10, 14, 22),
      task('Validation', 'Data validation', 'Row counts, checksums, and spot checks.', 8, 12, 18),
      task('Cutover', 'Cutover & rollback', 'Production switch with a tested rollback path.', 6, 10, 18),
    ],
  ),
  project(
    'demo-support-chat',
    'Support Chat Integration',
    false,
    '2026-11-01T14:20:00.000Z',
    '2026-11-13T16:48:00.000Z',
    39,
    [
      task('Evaluation', 'Vendor evaluation', 'Compare vendors on cost, API, and data residency.', 4, 6, 10),
      task('Build', 'Widget integration', 'Embedded chat with authenticated customer context.', 6, 10, 16),
      task('Build', 'Routing & handoff', 'Queue routing, transcripts, and ticket handoff.', 8, 12, 20),
      task('Enablement', 'Agent training', 'Playbooks for the support team.', 4, 6, 10),
    ],
  ),
  project(
    'demo-compliance-audit',
    'Quarterly Compliance Audit',
    false,
    '2026-09-29T08:15:00.000Z',
    '2026-11-08T09:50:00.000Z',
    62,
    [
      task('Evidence', 'Evidence collection', 'Gather policies, logs, and access reviews.', 8, 12, 18),
      task('Testing', 'Control testing', 'Sample controls across infrastructure and access.', 10, 16, 26),
      task('Remediation', 'Remediation', 'Close findings and document exceptions.', 12, 20, 36),
      task('Reporting', 'Final report', 'Summarize posture and next-quarter actions.', 4, 8, 12),
    ],
  ),
  project(
    'demo-docs-site',
    'Developer Docs Site',
    false,
    '2026-09-18T15:30:00.000Z',
    '2026-11-05T10:05:00.000Z',
    47,
    [
      task('Content', 'Content inventory', 'Audit existing docs and flag stale pages.', 4, 6, 10),
      task('Build', 'Docs framework', 'Set up the static site, navigation, and versioning.', 8, 12, 20),
      task('Build', 'API reference', 'Generate reference pages from the OpenAPI schema.', 10, 16, 26),
      task('Launch', 'Search & deploy', 'Search indexing, redirects, and deployment pipeline.', 4, 8, 12),
    ],
  ),
]
