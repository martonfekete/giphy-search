# GiphySearch

## Dev notes

### Preventing bad words
The app supports setting up a list of prevented words that will not trigger a search. The array can be found in `/assets/badwords.json`.
Whenever building or using the app on a dev server, the endpoint for the bad words can be defined as part of the corresponding environment file (e.g. `environments/environment.prod.ts`)

## Future extension
1. load more gifs based on scroll
2. URL-based search
3. Auto-suggest query

### Load more on scroll
Current implementation is a basic pagination for demonstration purposes. If this app was built for wide-spread use, a first-to-improve on the UX would be to get rid of the dated pagination-logic and add scroll-based loading of additonal images. As I have no information about the target audience or user personas for the purposes of this coding challenge, I didn't think this functionality would be necessary.

### URL-based search
Current implementation does not support searching based on entry URL so our users always have to load the empty page and proceed with a query manually. For the purposes of an image search, I don't think it would be necessary to add URL-based searching because I don't think anyone is using image lookups like that. However, if an app was built with similar logic (query > results), but with a different end goal in mind and a different API (e.g. looking up a shipment reference), then creating an entry URL which immediately triggers the first query would be beneficial.

### Auto-suggest query
As the Giphy API supports additional endpoints, it could be beneficial for potential users to suggest trending phrases along with the app's current basic query field.
Another possible list for suggestions might come from previously recorded query parameters based on actual uses of this specific app.

## Notes on building and running

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests
##### Note that the app does not have any E2E tests built. Functionality is covered by unit tests.
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
