import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

describe('localize-behavior', function() {
	let component;

	describe('Polymer Behavior', function() {
		beforeEach(() => {
			document.documentElement.removeAttribute('lang');
		});

		it('should have default language', done => {
			component = fixture('default-fixture');

			requestAnimationFrame(() => {
				expect(component.language).to.equal('en');
				expect(component.localize('allCourses')).to.equal('All Courses');
				done();
			});
		});

		it('should use lang specified', done => {
			document.documentElement.setAttribute('lang', 'fr');

			component = fixture('default-fixture');

			requestAnimationFrame(() => {
				expect(component.language).to.equal('fr');
				expect(component.localize('allCourses')).to.equal('Tous les cours');
				done();
			});
		});

		it('should use default language if provided language does not exist', done => {
			document.documentElement.setAttribute('lang', 'zz-ZZ');

			component = fixture('default-fixture');

			requestAnimationFrame(() => {
				expect(component.language).to.equal('en');
				expect(component.localize('allCourses')).to.equal('All Courses');
				done();
			});
		});
	});

	describe('Lit Mixin', function() {
		const documentLocaleSettings = getDocumentLocaleSettings();

		afterEach(() => {
			documentLocaleSettings.reset();
		});

		it('should have default language', done => {
			component = fixture('lit-fixture');

			requestAnimationFrame(() => {
				expect(component.localize('allCourses')).to.equal('All Courses');
				done();
			});
		});

		it('should use lang specified', done => {
			documentLocaleSettings.language = 'fr';
			component = fixture('lit-fixture');

			requestAnimationFrame(() => {
				expect(component.localize('allCourses')).to.equal('Tous les cours');
				done();
			});
		});

		it('should use default language if provided language does not exist', done => {
			documentLocaleSettings.language = 'zz-ZZ';
			component = fixture('lit-fixture');

			requestAnimationFrame(() => {
				expect(component.localize('allCourses')).to.equal('All Courses');
				done();
			});
		});
	});

	describe('Verify Mappings', function() {
		it('should have translation for every english term', function() {
			component = fixture('default-fixture');
			const terms = Object.keys(component.resources['en']);
			const locales = Object.keys(component.resources);
			for (let i = 0; i < locales.length; i++) {
				const currentLocale = locales[i];
				for (let j = 0; j < terms.length; j++) {
					expect(component.resources[currentLocale].hasOwnProperty(terms[j]), `missing term ${terms[j]} on locale ${currentLocale}`).to.be.true;
				}
			}
		});

		it('should have no empty mappings for supported langs', function() {
			component = fixture('default-fixture');
			const locales = Object.keys(component.resources);
			for (let i = 0; i < locales.length; i++) {
				const currentLocale = locales[i];
				const mappings = Object.values(component.resources[currentLocale]);
				for (let j = 0; j < mappings.length; j++) {
					expect(mappings[j].trim()).to.not.equal('');
				}
			}
		});
	});
});
