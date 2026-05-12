# Graph Report - .  (2026-04-30)

## Corpus Check
- Large corpus: 331 files · ~1,535,352 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 659 nodes · 576 edges · 72 communities detected
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]

## God Nodes (most connected - your core abstractions)
1. `ProjectService` - 51 edges
2. `CostTabComponent` - 30 edges
3. `CreateProjectModalComponent` - 23 edges
4. `MilestoneTabComponent` - 19 edges
5. `ProjectSidebarComponent` - 19 edges
6. `RiskTabComponent` - 18 edges
7. `LandingComponent` - 13 edges
8. `AuthService` - 12 edges
9. `OverviewComponent` - 12 edges
10. `FilesTabComponent` - 11 edges

## Surprising Connections (you probably didn't know these)
- `withProjectTitle()` --calls--> `projectSummary()`  [INFERRED]
  mock-server/routes/v1/risks.routes.js → mock-server/routes/v1/_store.js
- `withComputedFields()` --calls--> `projectSummary()`  [INFERRED]
  mock-server/routes/v1/products.routes.js → mock-server/routes/v1/_store.js
- `withProjectFields()` --calls--> `projectSummary()`  [INFERRED]
  mock-server/routes/v1/psp-mappings.routes.js → mock-server/routes/v1/_store.js
- `setupSuccessRoutes()` --calls--> `setupSilentAuth()`  [INFERRED]
  cypress/e2e/project-details/shared.cy.ts → cypress/e2e/helpers/v1.ts
- `setupSuccessRoutes()` --calls--> `paginated()`  [INFERRED]
  cypress/e2e/project-details/shared.cy.ts → cypress/e2e/helpers/v1.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.0
Nodes (1): ProjectService

### Community 1 - "Community 1"
Cohesion: 0.0
Nodes (11): calculateBudgetTrend(), toConsumptionPercent(), calculateCustomerSatisfactionTrend(), getDirection(), safePercentDelta(), toTrendResult(), calculateQualityTrend(), calculateResourcesTrend() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.0
Nodes (1): CostTabComponent

### Community 3 - "Community 3"
Cohesion: 0.0
Nodes (1): CreateProjectModalComponent

### Community 4 - "Community 4"
Cohesion: 0.0
Nodes (2): getRiskTypeOptions(), RiskTabComponent

### Community 5 - "Community 5"
Cohesion: 0.0
Nodes (1): ProjectSidebarComponent

### Community 6 - "Community 6"
Cohesion: 0.0
Nodes (8): withProjectFields(), withComputedFields(), withProjectFields(), withProjectTitle(), getProjectById(), inferContentType(), normalizeFileEntry(), projectSummary()

### Community 7 - "Community 7"
Cohesion: 0.0
Nodes (1): MilestoneTabComponent

### Community 8 - "Community 8"
Cohesion: 0.0
Nodes (4): RiskCardComponent, getProbabilityOptions(), getSeverityOptions(), getStatusOptions()

### Community 9 - "Community 9"
Cohesion: 0.0
Nodes (1): LandingComponent

### Community 10 - "Community 10"
Cohesion: 0.0
Nodes (1): AuthService

### Community 11 - "Community 11"
Cohesion: 0.0
Nodes (1): FilesTabComponent

### Community 12 - "Community 12"
Cohesion: 0.0
Nodes (1): OverviewComponent

### Community 13 - "Community 13"
Cohesion: 0.0
Nodes (1): FilterPanelComponent

### Community 14 - "Community 14"
Cohesion: 0.0
Nodes (1): ProjectDetailsComponent

### Community 15 - "Community 15"
Cohesion: 0.0
Nodes (1): StateCardComponent

### Community 16 - "Community 16"
Cohesion: 0.0
Nodes (1): StateTabComponent

### Community 17 - "Community 17"
Cohesion: 0.0
Nodes (1): InlineEditFieldComponent

### Community 18 - "Community 18"
Cohesion: 0.0
Nodes (1): CostBreakdownRowComponent

### Community 19 - "Community 19"
Cohesion: 0.0
Nodes (3): paginated(), setupSilentAuth(), setupSuccessRoutes()

### Community 20 - "Community 20"
Cohesion: 0.0
Nodes (1): SelectComponent

### Community 21 - "Community 21"
Cohesion: 0.0
Nodes (1): HttpErrorInterceptor

### Community 22 - "Community 22"
Cohesion: 0.0
Nodes (1): FilterStateService

### Community 23 - "Community 23"
Cohesion: 0.0
Nodes (1): AuthInterceptor

### Community 24 - "Community 24"
Cohesion: 0.0
Nodes (3): main(), run(), waitForUrl()

### Community 26 - "Community 26"
Cohesion: 0.0
Nodes (1): ConfirmDialogComponent

### Community 27 - "Community 27"
Cohesion: 0.0
Nodes (1): AvatarComponent

### Community 28 - "Community 28"
Cohesion: 0.0
Nodes (1): ErrorLoggerService

### Community 29 - "Community 29"
Cohesion: 0.0
Nodes (1): ConfirmDialogService

### Community 30 - "Community 30"
Cohesion: 0.0
Nodes (1): ProjectCardComponent

### Community 31 - "Community 31"
Cohesion: 0.0
Nodes (1): ProjectSelectorComponent

### Community 32 - "Community 32"
Cohesion: 0.0
Nodes (1): FileRowComponent

### Community 33 - "Community 33"
Cohesion: 0.0
Nodes (2): run(), wait()

### Community 34 - "Community 34"
Cohesion: 0.0
Nodes (2): findCostProject(), withCostProjectFields()

### Community 35 - "Community 35"
Cohesion: 0.0
Nodes (3): toAmount(), toDecimal(), withComputed()

### Community 37 - "Community 37"
Cohesion: 0.0
Nodes (1): ErrorModalComponent

### Community 38 - "Community 38"
Cohesion: 0.0
Nodes (1): FileInputComponent

### Community 39 - "Community 39"
Cohesion: 0.0
Nodes (1): DatePickerComponent

### Community 40 - "Community 40"
Cohesion: 0.0
Nodes (1): GlobalErrorHandler

### Community 41 - "Community 41"
Cohesion: 0.0
Nodes (1): ErrorModalService

### Community 42 - "Community 42"
Cohesion: 0.0
Nodes (1): ProjectPreviewComponent

### Community 43 - "Community 43"
Cohesion: 0.0
Nodes (1): ProjectListComponent

### Community 44 - "Community 44"
Cohesion: 0.0
Nodes (1): RiskHeatmapComponent

### Community 45 - "Community 45"
Cohesion: 0.0
Nodes (1): KpiCardComponent

### Community 46 - "Community 46"
Cohesion: 0.0
Nodes (1): CostOverviewCardComponent

### Community 48 - "Community 48"
Cohesion: 0.0
Nodes (2): loadEnv(), parseEnv()

### Community 49 - "Community 49"
Cohesion: 0.0
Nodes (1): InputComponent

### Community 50 - "Community 50"
Cohesion: 0.0
Nodes (1): ButtonComponent

### Community 51 - "Community 51"
Cohesion: 0.0
Nodes (2): IconComponent, IconRegistryModule

### Community 52 - "Community 52"
Cohesion: 0.0
Nodes (1): CostBarChartComponent

### Community 53 - "Community 53"
Cohesion: 0.0
Nodes (1): TabNavComponent

### Community 54 - "Community 54"
Cohesion: 0.0
Nodes (1): CostTableComponent

### Community 55 - "Community 55"
Cohesion: 0.0
Nodes (1): BudgetChartComponent

### Community 56 - "Community 56"
Cohesion: 0.0
Nodes (1): CostSubNavComponent

### Community 65 - "Community 65"
Cohesion: 0.0
Nodes (1): AppComponent

### Community 66 - "Community 66"
Cohesion: 0.0
Nodes (1): ThreeColumnLayoutComponent

### Community 67 - "Community 67"
Cohesion: 0.0
Nodes (1): PageHeaderComponent

### Community 68 - "Community 68"
Cohesion: 0.0
Nodes (1): PageShellComponent

### Community 69 - "Community 69"
Cohesion: 0.0
Nodes (1): SkeletonBlockComponent

### Community 70 - "Community 70"
Cohesion: 0.0
Nodes (1): DividerComponent

### Community 71 - "Community 71"
Cohesion: 0.0
Nodes (1): TagComponent

### Community 72 - "Community 72"
Cohesion: 0.0
Nodes (1): BadgeComponent

### Community 75 - "Community 75"
Cohesion: 0.0
Nodes (1): SkeletonCardComponent

### Community 77 - "Community 77"
Cohesion: 0.0
Nodes (1): SkeletonKpiGridComponent

### Community 78 - "Community 78"
Cohesion: 0.0
Nodes (1): SkeletonStateGridComponent

### Community 79 - "Community 79"
Cohesion: 0.0
Nodes (1): SkeletonMilestoneListComponent

### Community 80 - "Community 80"
Cohesion: 0.0
Nodes (1): SkeletonCostComponent

### Community 81 - "Community 81"
Cohesion: 0.0
Nodes (1): CostDetailTableComponent

### Community 82 - "Community 82"
Cohesion: 0.0
Nodes (1): SkeletonFileListComponent

### Community 83 - "Community 83"
Cohesion: 0.0
Nodes (1): SkeletonSidebarComponent

### Community 84 - "Community 84"
Cohesion: 0.0
Nodes (1): SkeletonRiskComponent

### Community 85 - "Community 85"
Cohesion: 0.0
Nodes (1): LoginComponent

## Knowledge Gaps
- **20 isolated node(s):** `AppComponent`, `ThreeColumnLayoutComponent`, `PageHeaderComponent`, `PageShellComponent`, `SkeletonBlockComponent` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 0`** (52 nodes): `ProjectService`, `.addPspProject()`, `.addRisk()`, `.applyProjectOverrides()`, `.buildRiskHeatmap()`, `.constructor()`, `.createProject()`, `.deleteFile()`, `.deletePspProject()`, `.getActiveCostSubViewIndex()`, `.getActiveTabIndex()`, `.getCostData()`, `.getFiles()`, `.getFilters()`, `.getMilestones()`, `.getMilestoneSets()`, `.getOverviewChartData()`, `.getProjectDetail()`, `.getProjects()`, `.getRisks()`, `.getStateCards()`, `.groupBreakdownsByPeriod()`, `.groupMappingsByProject()`, `.latestReportingPeriod()`, `.mapFileToUi()`, `.mapMilestone()`, `.mapProject()`, `.mapRiskPatchToApi()`, `.mapRiskToUi()`, `.riskLevelToColumn()`, `.riskLevelToRow()`, `.saveState()`, `.setActiveCostSubViewIndex()`, `.setActiveTabIndex()`, `.setProjectOverride()`, `.stateValueFromColor()`, `.statusColorFromCard()`, `.statusNameForCard()`, `.sumBreakdown()`, `.syncPspMappings()`, `.toNumber()`, `.toReportingPeriod()`, `.toRiskText()`, `.toStateCardsFromStatuses()`, `.unique()`, `.unwrapResults()`, `.updateCostBreakdown()`, `.updateMetadata()`, `.updateMilestone()`, `.updateRisk()`, `.uploadFile()`, `project.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 2`** (30 nodes): `CostTabComponent`, `.breakdownLineDatasets()`, `.breakdownModeOptions()`, `.buildOptionList()`, `.constructor()`, `.currentFilters()`, `.fetchCostData()`, `.fyOptions()`, `.monthlyRows()`, `.ngOnChanges()`, `.ngOnInit()`, `.normalizeCostData()`, `.onBreakdownModeChange()`, `.onBreakdownRowSave()`, `.onFyFilterChange()`, `.onMonthlyDataTypeChange()`, `.onProjectFilterChange()`, `.onPspProjectFilterChange()`, `.onSubViewChange()`, `.productRows()`, `.projectOptions()`, `.pspProjectOptions()`, `.reportingPeriod()`, `.setSubViewByIndex()`, `.targetCostStateCard()`, `.toCostLabel()`, `.topCostCardTitle()`, `.topCostLabel()`, `.toSubViewIndex()`, `cost-tab.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (24 nodes): `CreateProjectModalComponent`, `.businessLineOptions()`, `.createInitialFormState()`, `.departmentOptions()`, `.isCreateDisabled()`, `.isValid()`, `.ngOnChanges()`, `.onAddPspElement()`, `.onBusinessLineChange()`, `.onCancelClick()`, `.onCreateClick()`, `.onDepartmentChange()`, `.onEndDateChange()`, `.onImageSelected()`, `.onPickImageClick()`, `.onPspDraftChange()`, `.onRemovePspElement()`, `.onStartDateChange()`, `.onTitleChange()`, `.onTypeChange()`, `.resetForm()`, `.shouldShowError()`, `.typeOptions()`, `create-project-modal.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (21 nodes): `getRiskTypeOptions()`, `RiskTabComponent`, `.activeRiskType()`, `.buildEmptyRisk()`, `.buildEmptyRiskData()`, `.constructor()`, `.fetchRisks()`, `.finalizeLoading()`, `.ngOnChanges()`, `.ngOnInit()`, `.normalizeGrid()`, `.normalizeHeatmap()`, `.normalizeRiskData()`, `.normalizeRiskEntry()`, `.normalizeRow()`, `.onAddRisk()`, `.onRiskFieldSaved()`, `.onRiskTypeChange()`, `.toNumber()`, `risk-type.config.ts`, `risk-tab.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (20 nodes): `ProjectSidebarComponent`, `.constructor()`, `.getInitials()`, `.getPspSaveFn()`, `.onAvatarEditClick()`, `.onAvatarFileSelected()`, `.onCancelAddPsp()`, `.onCancelEditTitle()`, `.onConfirmAddPsp()`, `.onDeletePspProject()`, `.onSaveTitle()`, `.onStartAddPsp()`, `.onStartEditTitle()`, `.onTitleDraftChange()`, `.readFileAsDataUrl()`, `.saveMetadataField()`, `.savePspProject()`, `.startEditing()`, `.stopEditing()`, `project-sidebar.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (19 nodes): `MilestoneTabComponent`, `.constructor()`, `.fetchMilestones()`, `.fetchMilestoneSets()`, `.getDelayDays()`, `.getDurationDays()`, `.milestoneSetOptions()`, `.milestoneTypeOptions()`, `.ngOnChanges()`, `.onEndDateChange()`, `.onMilestoneSetChange()`, `.onStartDateChange()`, `.summaryDelayDays()`, `.timelineStatus()`, `.timelineTrendClass()`, `.timelineTrendIconName()`, `.timelineTrendPercent()`, `.updateMilestone()`, `milestone-tab.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (14 nodes): `LandingComponent`, `.loadFilters()`, `.loadProjects()`, `.ngOnInit()`, `.onCloseCreateProjectModal()`, `.onCreateProject()`, `.onOpenCreateProjectModal()`, `.onOpenProject()`, `.onReset()`, `.onSearch()`, `.onSelectProject()`, `.onValuesChange()`, `.resolveSelectedProject()`, `landing.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (13 nodes): `AuthService`, `.clearTokens()`, `.constructor()`, `.ensureAccessToken()`, `.forceAuthenticate()`, `.getAccessToken()`, `.getAccessTokenForRequest()`, `.getRoleOverride()`, `.getUser()`, `.isAuthenticated()`, `.logout()`, `.mapBackendRole()`, `auth.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (12 nodes): `FilesTabComponent`, `.constructor()`, `.fetchFiles()`, `.files()`, `.finalizeLoading()`, `.ngOnChanges()`, `.ngOnInit()`, `.onAddFile()`, `.onDeleteRequested()`, `.onDownloadRequested()`, `.onUploadSelected()`, `files-tab.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (12 nodes): `OverviewComponent`, `.budgetDatasets()`, `.constructor()`, `.fetchCards()`, `.findCard()`, `.formatProjectDate()`, `.getIconName()`, `.kpis()`, `.ngOnChanges()`, `.projectInitials()`, `.statusLabelForValue()`, `overview.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (11 nodes): `FilterPanelComponent`, `.businessLineOptions()`, `.departmentOptions()`, `.emitValues()`, `.onBusinessLineChange()`, `.onDepartmentChange()`, `.onReset()`, `.onSearch()`, `.onTypeChange()`, `.typeOptions()`, `filter-panel.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (10 nodes): `ProjectDetailsComponent`, `.constructor()`, `.loadProjectDetail()`, `.loadProjects()`, `.ngOnInit()`, `.onNavigateToProjects()`, `.onProjectSelected()`, `.onRouteParamChange()`, `.onTabSelected()`, `project-details.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (10 nodes): `state-card.component.ts`, `StateCardComponent`, `.metricIconName()`, `.onCancelNarrative()`, `.onConfirmNarrative()`, `.onNarrativeChange()`, `.onStartEdit()`, `.statusLabel()`, `.tierClass()`, `.trendIconName()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (8 nodes): `state-tab.component.ts`, `StateTabComponent`, `.constructor()`, `.loadStateCards()`, `.ngOnChanges()`, `.ngOnInit()`, `.onNarrativeSaved()`, `.onSaveState()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (8 nodes): `InlineEditFieldComponent`, `.ngOnChanges()`, `.onCancel()`, `.onConfirm()`, `.onDismissError()`, `.onDraftChange()`, `.onEditStart()`, `inline-edit-field.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (8 nodes): `CostBreakdownRowComponent`, `.ngOnChanges()`, `.onDateSelected()`, `.onSaveActual()`, `.onSaveDate()`, `.onSaveTarget()`, `.trendIconName()`, `cost-breakdown-row.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (7 nodes): `SelectComponent`, `.ngOnChanges()`, `.onChange()`, `.resolveValue()`, `.selectedValue()`, `.value()`, `select.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (7 nodes): `HttpErrorInterceptor`, `.constructor()`, `.getErrorCode()`, `.intercept()`, `.shouldSuppressModal()`, `.toModalConfig()`, `http-error.interceptor.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (7 nodes): `FilterStateService`, `.getFilterValues()`, `.getSelectedProjectId()`, `.reset()`, `.setFilterValues()`, `.setSelectedProjectId()`, `filter-state.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (6 nodes): `AuthInterceptor`, `.constructor()`, `.intercept()`, `.isApiRequest()`, `.isAuthRoute()`, `auth.interceptor.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (5 nodes): `ConfirmDialogComponent`, `.constructor()`, `.onCancel()`, `.onConfirm()`, `confirm-dialog.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (5 nodes): `AvatarComponent`, `.ngOnChanges()`, `.onImageError()`, `.sizeClass()`, `avatar.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (5 nodes): `ErrorLoggerService`, `.constructor()`, `.log()`, `.setRemoteTransport()`, `error-logger.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (5 nodes): `ConfirmDialogService`, `.cancel()`, `.confirm()`, `.open()`, `confirm-dialog.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (5 nodes): `ProjectCardComponent`, `.getInitials()`, `.onOpen()`, `.onSelect()`, `project-card.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (5 nodes): `ProjectSelectorComponent`, `.onProjectChange()`, `.options()`, `.selectedValue()`, `project-selector.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (5 nodes): `FileRowComponent`, `.fileSizeLabel()`, `.onDeleteClick()`, `.onDownloadClick()`, `file-row.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (4 nodes): `check.mjs`, `run()`, `stopServer()`, `wait()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (4 nodes): `cost-breakdowns.routes.js`, `findCostProject()`, `toNumber()`, `withCostProjectFields()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (4 nodes): `ErrorModalComponent`, `.constructor()`, `.onPrimaryAction()`, `error-modal.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (4 nodes): `FileInputComponent`, `.onFileChange()`, `.open()`, `file-input.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (4 nodes): `DatePickerComponent`, `.displayValue()`, `.onChange()`, `date-picker.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (4 nodes): `GlobalErrorHandler`, `.constructor()`, `.handleError()`, `global-error.handler.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (4 nodes): `ErrorModalService`, `.hide()`, `.showError()`, `error-modal.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (4 nodes): `ProjectPreviewComponent`, `.getInitials()`, `.onOpenProject()`, `project-preview.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (4 nodes): `ProjectListComponent`, `.onOpenProject()`, `.onSelectProject()`, `project-list.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (4 nodes): `RiskHeatmapComponent`, `.getCellClass()`, `.getCellValue()`, `risk-heatmap.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (4 nodes): `KpiCardComponent`, `.tierClass()`, `.trendIconName()`, `kpi-card.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (4 nodes): `CostOverviewCardComponent`, `.dataCyId()`, `.toKiloEuro()`, `cost-overview-card.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (3 nodes): `load-env.js`, `loadEnv()`, `parseEnv()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (3 nodes): `InputComponent`, `.onValueChange()`, `input.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (3 nodes): `ButtonComponent`, `.onClick()`, `button.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (3 nodes): `IconComponent`, `IconRegistryModule`, `icon.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (3 nodes): `CostBarChartComponent`, `.data()`, `cost-bar-chart.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (3 nodes): `tab-nav.component.ts`, `TabNavComponent`, `.onSelect()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (3 nodes): `CostTableComponent`, `.onToggle()`, `cost-table.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (3 nodes): `BudgetChartComponent`, `.data()`, `budget-chart.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (3 nodes): `CostSubNavComponent`, `.onSelect()`, `cost-sub-nav.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (2 nodes): `AppComponent`, `app.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (2 nodes): `three-column-layout.component.ts`, `ThreeColumnLayoutComponent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (2 nodes): `PageHeaderComponent`, `page-header.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (2 nodes): `PageShellComponent`, `page-shell.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (2 nodes): `SkeletonBlockComponent`, `skeleton-block.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (2 nodes): `DividerComponent`, `divider.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 71`** (2 nodes): `tag.component.ts`, `TagComponent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (2 nodes): `BadgeComponent`, `badge.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (2 nodes): `SkeletonCardComponent`, `skeleton-card.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (2 nodes): `SkeletonKpiGridComponent`, `skeleton-kpi-grid.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (2 nodes): `SkeletonStateGridComponent`, `skeleton-state-grid.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (2 nodes): `SkeletonMilestoneListComponent`, `skeleton-milestone-list.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (2 nodes): `SkeletonCostComponent`, `skeleton-cost.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (2 nodes): `CostDetailTableComponent`, `cost-detail-table.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (2 nodes): `SkeletonFileListComponent`, `skeleton-file-list.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (2 nodes): `SkeletonSidebarComponent`, `skeleton-sidebar.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (2 nodes): `SkeletonRiskComponent`, `skeleton-risk.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (2 nodes): `LoginComponent`, `login.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.