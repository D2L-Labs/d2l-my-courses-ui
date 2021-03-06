/*
`d2l-all-courses-legacy`
Polymer-based web component for all courses.

This component is only rendered if the `d2l.Tools.MyCoursesWidget.UpdatedSortLogic` config variable is off, meaning `updated-sort-logic` is false.
TODO: There is still lots of cleanup here to remove UpdatedSortLogic ON logic from this file, but plan is to remove this whole legacy code path instead.
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '@brightspace-ui/core/components/alert/alert.js';
import '@brightspace-ui/core/components/dropdown/dropdown.js';
import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import { Classes } from 'd2l-hypermedia-constants';
import { Actions } from 'd2l-hypermedia-constants';
import { Rels } from 'd2l-hypermedia-constants';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/link/link.js';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item-radio.js';
import 'd2l-organization-hm-behavior/d2l-organization-hm-behavior.js';
import 'd2l-simple-overlay/d2l-simple-overlay.js';
import SirenParse from 'siren-parser';
import './d2l-alert-behavior-legacy.js';
import './d2l-all-courses-styles-legacy.js';
import './search-filter/d2l-filter-menu-legacy.js';
import './search-filter/d2l-search-widget-custom-legacy.js';
import './d2l-utility-behavior-legacy.js';
import './localize-behavior-legacy.js';
import './tile-grid/d2l-all-courses-segregated-content.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-all-courses-legacy">
	<template strip-whitespace="">
		<style include="d2l-all-courses-styles-legacy"></style>

		<d2l-simple-overlay
			id="all-courses"
			title-name="[[localize('allCourses')]]"
			close-simple-overlay-alt-text="[[localize('closeSimpleOverlayAltText')]]"
			with-backdrop=""
			restore-focus-on-close="">

			<div hidden$="[[!_showContent]]">
				<iron-scroll-threshold id="all-courses-scroll-threshold" on-lower-threshold="_onAllCoursesLowerThreshold">
				</iron-scroll-threshold>

				<div id="search-and-filter">
					<div class="search-and-filter-row">
						<d2l-search-widget-custom-legacy
							id="search-widget"
							org-unit-type-ids="[[orgUnitTypeIds]]"
							search-action="[[_enrollmentsSearchAction]]"
							search-url="[[_searchUrl]]">
						</d2l-search-widget-custom-legacy>

						<div id="filterAndSort">
							<d2l-dropdown id="filterDropdown">
								<button class="d2l-dropdown-opener dropdown-button" aria-labelledby="filterText">
									<span id="filterText" class="dropdown-opener-text">[[_filterText]]</span>
									<d2l-icon icon="d2l-tier1:chevron-down" aria-hidden="true"></d2l-icon>
								</button>
								<d2l-dropdown-content id="filterDropdownContent" no-padding="" min-width="350" render-content="">
									<d2l-filter-menu-legacy
										id="filterMenu"
										tab-search-type="[[tabSearchType]]"
										org-unit-type-ids="[[orgUnitTypeIds]]"
										my-enrollments-entity="[[myEnrollmentsEntity]]"
										filter-standard-semester-name="[[filterStandardSemesterName]]"
										filter-standard-department-name="[[filterStandardDepartmentName]]">
									</d2l-filter-menu-legacy>
								</d2l-dropdown-content>
							</d2l-dropdown>

							<d2l-dropdown id="sortDropdown">
								<button class="d2l-dropdown-opener dropdown-button" aria-labelledby="sortText">
									<span id="sortText" class="dropdown-opener-text">[[localize('sorting.sortCourseName')]]</span>
									<d2l-icon icon="d2l-tier1:chevron-down" aria-hidden="true"></d2l-icon>
								</button>
								<d2l-dropdown-menu no-padding="" min-width="350">
									<d2l-menu id="sortDropdownMenu" label="[[localize('sorting.sortBy')]]">
										<div class="dropdown-content-header">
											<span>[[localize('sorting.sortBy')]]</span>
										</div>
										<d2l-menu-item-radio hidden$="[[!updatedSortLogic]]" class="dropdown-content-gradient" value="Default" text="[[localize('sorting.sortDefault')]]"></d2l-menu-item-radio>
										<d2l-menu-item-radio value="OrgUnitName" class$="[[_showDropdownGradient(updatedSortLogic)]]" text="[[localize('sorting.sortCourseName')]]"></d2l-menu-item-radio>
										<d2l-menu-item-radio value="OrgUnitCode" text="[[localize('sorting.sortCourseCode')]]"></d2l-menu-item-radio>
										<d2l-menu-item-radio value="PinDate" text="[[localize('sorting.sortDatePinned')]]"></d2l-menu-item-radio>
										<d2l-menu-item-radio value="LastAccessed" text="[[localize('sorting.sortLastAccessed')]]"></d2l-menu-item-radio>
										<d2l-menu-item-radio hidden$="[[!updatedSortLogic]]" value="EnrollmentDate" text="[[localize('sorting.sortEnrollmentDate')]]"></d2l-menu-item-radio>
									</d2l-menu>
								</d2l-dropdown-menu>
							</d2l-dropdown>
						</div>
					</div>
					<div class="search-and-filter-row advanced-search-link" hidden$="[[!_showAdvancedSearchLink]]">
						<d2l-link href$="[[advancedSearchUrl]]">[[localize('advancedSearch')]]</d2l-link>
					</div>
				</div>

				<template is="dom-repeat" items="[[_alertsView]]">
					<d2l-alert type="[[item.alertType]]">
						[[item.alertMessage]]
					</d2l-alert>
				</template>
				<d2l-all-courses-segregated-content
					show-course-code="[[showCourseCode]]"
					show-semester="[[showSemester]]"
					course-updates-config="[[courseUpdatesConfig]]"
					total-filter-count="[[_totalFilterCount]]"
					filter-counts="[[_filterCounts]]"
					is-searched="[[_isSearched]]"
					filtered-pinned-enrollments="[[_filteredPinnedEnrollments]]"
					filtered-unpinned-enrollments="[[_filteredUnpinnedEnrollments]]">
				</d2l-all-courses-segregated-content>
				<d2l-loading-spinner id="lazyLoadSpinner" hidden$="[[!_hasMoreEnrollments]]" size="100">
				</d2l-loading-spinner>
			</div>
			<d2l-loading-spinner hidden$="[[_showContent]]" size="100">
			</d2l-loading-spinner>
		</d2l-simple-overlay>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-all-courses-legacy',
	properties: {
		// URL that directs to the advanced search page
		advancedSearchUrl: String,
		// Types of notifications to include in update count in course tile
		courseUpdatesConfig: Object,
		// Default option in Sort menu
		defaultSortValue: {
			type: String,
			value: 'OrgUnitName'
		},
		// Standard Department OU Type name to be displayed in the filter dropdown
		filterStandardDepartmentName: String,
		// Standard Semester OU Type name to be displayed in the filter dropdown
		filterStandardSemesterName: String,
		// Object containing the last response from an enrollments search request
		lastEnrollmentsSearchResponse: Object,
		// Entity returned from my-enrollments Link from the enrollments root
		myEnrollmentsEntity: {
			type: Object,
			value: function() { return {}; },
			observer: '_myEnrollmentsEntityChanged'
		},
		showCourseCode: Boolean,
		showSemester: Boolean,
		orgUnitTypeIds: Array,
		// Siren Actions corresponding to each tab that is displayed
		tabSearchActions: {
			type: Array,
			value: function() { return []; }
		},
		// Type of tabs being displayed (BySemester, ByDepartment, ByRoleAlias)
		tabSearchType: String,
		// Feature flag (switch) for using the updated sort logic and related fetaures
		updatedSortLogic: {
			type: Boolean,
			value: false,
			observer: '_updatedSortLogicChanged'
		},
		hasEnrollmentsChanged: {
			type: Boolean,
			value: false
		},

		/*
		* Private Polymer properties
		*/

		// search-my-enrollments Action
		_enrollmentsSearchAction: Object,
		// URL constructed to fetch a user's enrollments with the enrollments search Action
		_enrollmentsSearchUrl: String,
		// Filter dropdown opener text
		_filterText: String,
		// filtered pinned enrollment entities
		_filteredPinnedEnrollments: {
			type: Array,
			value: function() { return []; }
		},
		_filteredUnpinnedEnrollments: {
			type: Array,
			value: function() { return []; }
		},
		// True when there are any filtered enrollments (pinned or unpinned)
		_hasFilteredEnrollments: Boolean,
		// True when there are more enrollments to fetch (i.e. current page of enrollments has a `next` link)
		_hasMoreEnrollments: {
			type: Boolean,
			computed: '_computeHasMoreEnrollments(lastEnrollmentsSearchResponse, _showTabContent)'
		},
		// Object containing the IDs of previously loaded pinned enrollments, to avoid duplicates
		_pinnedCoursesMap: {
			type: Object,
			value: function() { return {}; }
		},
		// Object containing the IDs of previously loaded unpinned enrollments, to avoid duplicates
		_unpinnedCoursesMap: {
			type: Object,
			value: function() { return {}; }
		},
		// URL passed to search widget, called for searching
		_searchUrl: String,
		_showAdvancedSearchLink: {
			type: Boolean,
			value: false,
			computed: '_computeShowAdvancedSearchLink(advancedSearchUrl)'
		},
		_showContent: {
			type: Boolean,
			value: false
		},
		_showGroupByTabs: {
			type: Boolean,
			computed: '_computeShowGroupByTabs(tabSearchActions)'
		},
		_showTabContent: {
			type: Boolean,
			value: false
		},
		// Number of filters currently selected; used to change opener text when menu closes
		_totalFilterCount: {
			type: Number,
			value: 0
		},
		_filterCounts: {
			type: Object,
			value: function() {
				return {
					departments: 0,
					semesters: 0,
					roles: 0
				};
			}
		},
		_updatedSortLogicInitallyObserved: {
			type: Boolean,
			value: false
		},
		_isSearched: Boolean,
		_bustCacheToken: Number,
		_selectedTabId: String
	},
	behaviors: [
		D2L.PolymerBehaviors.Hypermedia.OrganizationHMBehavior,
		D2L.PolymerBehaviors.MyCourses.LocalizeBehaviorLegacy,
		D2L.MyCourses.AlertBehaviorLegacy,
		D2L.MyCourses.UtilityBehaviorLegacy
	],
	listeners: {
		'd2l-simple-overlay-opening': '_onSimpleOverlayOpening',
		'd2l-course-pinned-change': '_onEnrollmentPinned'
	},
	observers: [
		'_enrollmentsChanged(_filteredPinnedEnrollments.length, _filteredUnpinnedEnrollments.length)'
	],
	ready: function() {
		this._filterText = this.localize('filtering.filter');
		this._bustCacheToken = Math.random();
	},
	attached: function() {
		this.listen(this.$.sortDropdown, 'd2l-menu-item-change', '_onSortOrderChanged');
		this.listen(this.$.filterDropdownContent, 'd2l-dropdown-open', '_onFilterDropdownOpen');
		this.listen(this.$.filterDropdownContent, 'd2l-dropdown-close', '_onFilterDropdownClose');
		this.listen(this.$.filterMenu, 'd2l-filter-menu-change', '_onFilterChanged');
		this.listen(this.$['search-widget'], 'd2l-search-widget-results-changed', '_onSearchResultsChanged');
		document.body.addEventListener('set-course-image', this._onSetCourseImage.bind(this));
	},
	detached: function() {
		this.unlisten(this.$.sortDropdown, 'd2l-menu-item-change', '_onSortOrderChanged');
		this.unlisten(this.$.filterDropdownContent, 'd2l-dropdown-open', '_onFilterDropdownOpen');
		this.unlisten(this.$.filterDropdownContent, 'd2l-dropdown-close', '_onFilterDropdownClose');
		this.unlisten(this.$.filterMenu, 'd2l-filter-menu-change', '_onFilterChanged');
		this.unlisten(this.$['search-widget'], 'd2l-search-widget-results-changed', '_onSearchResultsChanged');
		document.body.removeEventListener('set-course-image', this._onSetCourseImage.bind(this));
	},
	/*
	* Public API methods
	*/

	load: function() {
		this.$['all-courses-scroll-threshold'].scrollTarget = this.$['all-courses'].scrollRegion;
		this.$['all-courses-scroll-threshold'].clearTriggers();
		if (!this.updatedSortLogic) {
			this._filteredPinnedEnrollments.forEach(function(item) {
				var identifier = item;
				this._pinnedCoursesMap[identifier] = true;
			}, this);

			this._filteredUnpinnedEnrollments.forEach(function(item) {
				var identifier = item;
				this._unpinnedCoursesMap[identifier] = true;
			}, this);
		}

		if (this._showGroupByTabs) {
			return;
		}

		this._showTabContent = true;

		if (!this.enrollmentsSearchAction) {
			return;
		}

		this._searchUrl = this._appendOrUpdateBustCacheQueryString(
			this.createActionUrl(this.enrollmentsSearchAction, {
				autoPinCourses: false,
				orgUnitTypeId: this.orgUnitTypeIds,
				embedDepth: this.updatedSortLogic ? 0 : 1,
				sort: this._sortParameter || (this.updatedSortLogic ? 'Current' : '-PinDate,OrgUnitName,OrgUnitId')
			})
		);
	},
	open: function() {
		// Initially hide the content, until we have some data to show
		// (set back to true in _onSearchResultsChanged). The exception
		// to this is when the overlay is closed then reopened - we want
		// to immediately show the already-loaded content.
		this._showContent = !!this._searchUrl;

		this.$$('#all-courses').open();
		this.load();
	},
	_onSetCourseImage: function(details) {
		this._removeAlert('setCourseImageFailure');

		if (details && details.detail) {
			if (details.detail.status === 'failure') {
				setTimeout(function() {
					this._addAlert('warning', 'setCourseImageFailure', this.localize('error.settingImage'));
				}.bind(this), 1000); // delay until the tile fail icon animation begins to kick in (1 sec delay)
			}
		}
	},

	/*
	* Listeners
	*/

	_onAllCoursesLowerThreshold: function() {
		if (this.$['all-courses'].opened && this.lastEnrollmentsSearchResponse) {
			var lastResponseEntity = SirenParse(this.lastEnrollmentsSearchResponse);

			if (lastResponseEntity && lastResponseEntity.hasLinkByRel('next')) {
				this._enrollmentsSearchUrl = lastResponseEntity.getLinkByRel('next').href;
				this.$.lazyLoadSpinner.scrollIntoView();

				return this.fetchSirenEntity(this._enrollmentsSearchUrl)
					.then(function(enrollmentsEntity) {
						this._updateFilteredEnrollments(enrollmentsEntity, true);
					}.bind(this));
			}
		}
	},
	_onFilterChanged: function(e) {
		this._searchUrl = this._appendOrUpdateBustCacheQueryString(e.detail.url);
		this._filterCounts = e.detail.filterCounts;
		this._totalFilterCount = this._filterCounts.departments + this._filterCounts.semesters + this._filterCounts.roles;
	},
	_onFilterDropdownClose: function() {
		var text;
		if (this._totalFilterCount === 0) {
			text = this.localize('filtering.filter');
		} else if (this._totalFilterCount === 1) {
			text = this.localize('filtering.filterSingle');
		} else {
			text = this.localize('filtering.filterMultiple', 'num', this._totalFilterCount);
		}
		this.set('_filterText', text);
	},
	_onFilterDropdownOpen: function() {
		this.set('_filterText', this.localize('filtering.filter'));
		return this.$.filterMenu.open();
	},
	_onSortOrderChanged: function(e) {
		var sortParameter, langterm;
		var promotePins = false;

		switch (e.detail.value) {
			case 'OrgUnitName':
				langterm = 'sorting.sortCourseName';
				sortParameter = this.updatedSortLogic ? 'OrgUnitName,OrgUnitId' : '-PinDate,OrgUnitName,OrgUnitId';
				break;
			case 'OrgUnitCode':
				langterm = 'sorting.sortCourseCode';
				sortParameter = this.updatedSortLogic ? 'OrgUnitCode,OrgUnitId' : '-PinDate,OrgUnitCode,OrgUnitId';
				break;
			case 'PinDate':
				langterm = 'sorting.sortDatePinned';
				sortParameter = '-PinDate,OrgUnitId';
				promotePins = this.updatedSortLogic;
				break;
			case 'LastAccessed':
				langterm = 'sorting.sortLastAccessed';
				sortParameter = this.updatedSortLogic ? 'LastAccessed' : 'LastAccessed';
				break;
			case 'EnrollmentDate':
				langterm = 'sorting.sortEnrollmentDate';
				sortParameter = '-LastModifiedDate,OrgUnitId';
				break;
			case 'Default':
				langterm = 'sorting.sortDefault';
				sortParameter = 'Current';
				promotePins = true;
				break;
			default:
				langterm = this.updatedSortLogic ? 'sorting.sortDefault' : 'sorting.sortCourseName';
				sortParameter =  this.updatedSortLogic ? 'Current' : '-PinDate,OrgUnitName,OrgUnitId';
				promotePins = this.updatedSortLogic;
				break;
		}

		this._searchUrl = this._appendOrUpdateBustCacheQueryString(
			this.createActionUrl(this._enrollmentsSearchAction, {
				sort: sortParameter,
				orgUnitTypeId: this.orgUnitTypeIds,
				promotePins: promotePins
			})
		);

		this._sortParameter = sortParameter;
		this.$.sortText.textContent = this.localize(langterm || '');
		this.$.sortDropdown.toggleOpen();
	},
	_onSearchResultsChanged: function(e) {
		this._isSearched = !!e.detail.searchValue;
		if (!this.updatedSortLogic) {
			this._pinnedCoursesMap = {};
			this._unpinnedCoursesMap = {};
		}
		this._updateFilteredEnrollments(e.detail.searchResponse, false);
		this.myEnrollmentsEntity = e.detail.searchResponse;
		this.fire('recalculate-columns');

		this._showContent = true;
		this._showTabContent = true;

		setTimeout(function() {
			// Triggers the course tiles to resize after switching tab
			window.dispatchEvent(new Event('resize'));
		}, 10);
	},
	_onSimpleOverlayOpening: function() {
		this._removeAlert('setCourseImageFailure');
		this._clearSearchWidget();
		this.$.filterMenu.clearFilters();
		this._filterText = this.localize('filtering.filter');
		this._resetSortDropdown();
		if (this.hasEnrollmentsChanged) {
			this._bustCacheToken = Math.random();
			this._searchUrl = this._appendOrUpdateBustCacheQueryString(this._searchUrl);
		}
	},
	_onEnrollmentPinned: function(e) {
		if (this._showGroupByTabs) {
			this._bustCacheToken = Math.random();
			var actionName = this._selectedTabId.replace('all-courses-tab-', '');
			if (!e.detail.isPinned &&  actionName === Actions.enrollments.searchMyPinnedEnrollments) {
				this._searchUrl = this._appendOrUpdateBustCacheQueryString(this._searchUrl);
			}
		}

		var orgUnitId;
		if (e.detail.orgUnitId) {
			orgUnitId = e.detail.orgUnitId;
		} else if (e.detail.organization) {
			orgUnitId = this._getOrgUnitIdFromHref(this.getEntityIdentifier(this.parseEntity(e.detail.organization)));
		} else if (e.detail.enrollment && e.detail.enrollment.hasLinkByRel(Rels.organization)) {
			orgUnitId = this._getOrgUnitIdFromHref(e.detail.enrollment.getLinkByRel(Rels.organization).href);
		}

		this.dispatchEvent(new CustomEvent('d2l-course-enrollment-change', {
			bubbles: true,
			composed: true,
			detail: {
				orgUnitId: orgUnitId,
				isPinned: e.detail.isPinned
			}
		}));
	},
	/*
	* Observers
	*/

	_enrollmentsChanged: function() {
		this.$['all-courses-scroll-threshold'].clearTriggers();
	},
	_myEnrollmentsEntityChanged: function(entity) {
		var myEnrollmentsEntity = SirenParse(entity);
		if (!myEnrollmentsEntity.hasActionByName(Actions.enrollments.searchMyEnrollments)) {
			return;
		}

		var searchAction = myEnrollmentsEntity.getActionByName(Actions.enrollments.searchMyEnrollments);
		this._enrollmentsSearchAction = searchAction;

		if (searchAction && searchAction.hasFieldByName('sort')) {
			var sortParameter = searchAction.getFieldByName('sort').value;
			if (!sortParameter) {
				return;
			}

			var sortMap = {
				'OrgUnitName,OrgUnitId': {
					name: 'OrgUnitName',
					langterm: 'sorting.sortCourseName'
				},
				// Only used if updatedSortLogic = false
				'-PinDate,OrgUnitName,OrgUnitId': {
					name: 'OrgUnitName',
					langterm: 'sorting.sortCourseName'
				},
				'OrgUnitCode,OrgUnitId': {
					name: 'OrgUnitCode',
					langterm: 'sorting.sortCourseCode'
				},
				// Only used if updatedSortLogic = false
				'-PinDate,OrgUnitCode,OrgUnitId': {
					name: 'OrgUnitCode',
					langterm: 'sorting.sortCourseCode'
				},
				'-PinDate,OrgUnitId': {
					name: 'PinDate',
					langterm: 'sorting.sortDatePinned'
				},
				'LastAccessed': {
					name: 'LastAccessed',
					langterm: 'sorting.sortLastAccessed'
				},
				'-LastModifiedDate,OrgUnitId': {
					name: 'EnrollmentDate',
					langterm: 'sorting.sortEnrollmentDate'
				},
				'Current': {
					name: 'Default',
					langterm: 'sorting.sortDefault'
				}
			};

			var sort = sortMap[sortParameter];
			if (sort) {
				this.$.sortText.textContent = this.localize(sort.langterm || '');
				this._selectSortOption(sort.name);
				this._sortParameter = sortParameter;
			} else {
				var langterm = this.updatedSortLogic ? 'sorting.sortDefault' : 'sorting.sortCourseName';
				this.$.sortText.textContent = this.localize(langterm);
				this._selectSortOption(this.defaultSortValue);
			}
		}
	},

	/*
	* Utility/helper functions
	*/

	_appendOrUpdateBustCacheQueryString: function(url) {
		if (!url) {
			return null;
		}

		var bustCacheStr = 'bustCache=';
		var index = url.indexOf(bustCacheStr);
		if (index === -1) {
			return url + (url.indexOf('?') !== -1 ? '&' : '?') + 'bustCache=' + this._bustCacheToken;
		}

		index += bustCacheStr.length;
		var prefix = url.substring(0, index);
		var suffix = url.substring(index, url.length);
		index = suffix.indexOf('&');
		suffix = index === -1 ? '' : suffix.substring(index, suffix.length);
		return prefix + this._bustCacheToken + suffix;
	},
	_clearFilteredCourses: function() {
		if (!this.updatedSortLogic) {
			this._pinnedCoursesMap = {};
			this._unpinnedCoursesMap = {};
		}
	},
	_clearSearchWidget: function() {
		this.$['search-widget'].clear();
		this._clearFilteredCourses();
	},
	_computeHasMoreEnrollments: function(lastResponse, showTabContent) {
		if (!showTabContent) {
			return false;
		}

		lastResponse = SirenParse(lastResponse);
		return lastResponse.hasLinkByRel('next');
	},
	_computeShowAdvancedSearchLink: function(link) {
		return !!link;
	},
	_computeShowGroupByTabs: function(groups) {
		return groups.length > 2 || (groups.length > 0 && !this._enrollmentsSearchAction);
	},
	_resetSortDropdown: function() {
		this._selectSortOption(this.defaultSortValue);

		var content = this.$.sortDropdown.__getContentElement();
		if (content) {
			content.close();
		}
	},
	_selectSortOption: function(sortName) {
		var items = this.$.sortDropdownMenu.querySelectorAll('d2l-menu-item-radio');
		for (var i = 0; i < items.length; i++) {
			items[i].selected = false;
		}

		this.$.sortDropdownMenu.querySelector('d2l-menu-item-radio[value=' + sortName + ']').selected = true;
	},
	_updateFilteredEnrollments: function(enrollments, append) {
		var enrollmentEntities = enrollments.getSubEntitiesByClass(Classes.enrollments.enrollment);

		var newPinnedEnrollments = [];
		var newUnpinnedEnrollments = [];
		enrollmentEntities.forEach(function(enrollment) {
			var enrollmentId = this.getEntityIdentifier(enrollment);

			if (enrollment.hasClass(Classes.enrollments.pinned)) {
				if (!this._pinnedCoursesMap.hasOwnProperty(enrollmentId)) {
					newPinnedEnrollments.push(enrollment);
					this._pinnedCoursesMap[enrollmentId] = true;
				}
			} else {
				if (!this._unpinnedCoursesMap.hasOwnProperty(enrollmentId)) {
					newUnpinnedEnrollments.push(enrollment);
					this._unpinnedCoursesMap[enrollmentId] = true;
				}
			}
		}, this);

		if (append) {
			this._filteredPinnedEnrollments = this._filteredPinnedEnrollments.concat(newPinnedEnrollments);
			this._filteredUnpinnedEnrollments = this._filteredUnpinnedEnrollments.concat(newUnpinnedEnrollments);
		} else {
			this._filteredPinnedEnrollments = newPinnedEnrollments;
			this._filteredUnpinnedEnrollments = newUnpinnedEnrollments;
		}

		this.lastEnrollmentsSearchResponse = enrollments;
		requestAnimationFrame(function() {
			window.dispatchEvent(new Event('resize')); // doing this so ie11 and older edge browser will get ms-grid style assigned
			this.$['all-courses-scroll-threshold'].clearTriggers();
		}.bind(this));
	},
	_showDropdownGradient: function(updatedSortLogic) {
		return updatedSortLogic ? '' : 'dropdown-content-gradient';
	},
	_updatedSortLogicChanged: function(updatedSortLogic) {
		if (this._updatedSortLogicInitallyObserved) {
			this.defaultSortValue = updatedSortLogic ? 'Default' : 'OrgUnitName';
			this._selectSortOption(this.defaultSortValue);
			var langterm = updatedSortLogic ? 'sorting.sortDefault' : 'sorting.sortCourseName';
			this.$.sortText.textContent = this.localize(langterm || '');
		} else {
			this._updatedSortLogicInitallyObserved = true;
		}
	},
	_getOrgUnitIdFromHref: function(organizationHref) {
		var match = /[0-9]+$/.exec(organizationHref);

		if (!match) {
			return;
		}
		return match[0];
	}

});
