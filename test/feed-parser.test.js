const feedParser = require('../src/feed-parser');

/**
 * feedParser(feed) async function returning an object if the feed URI is correct and there are
 * things to parse. Invalid URI or non-feed URI should throw an error.
*/
test('passing a valid Atom feed URI and getting title of first post', async () => {
  const data = await feedParser('https://c3ho.blogspot.com/feeds/posts/default/-/open-source?alt=rss');
  expect(data[data.length - 1].title).toBe('First Post!');
});

test('Passing an invalid ATOM feed URI should error', async () => {
  await expect(feedParser('c3ho.blogspot.com/feeds/posts/default/-/open-source?alt=rss')).rejects.toThrow('error');
});

test('Passing a valid RSS feed URI and getting title of first post', async () => {
  const data = await feedParser('https://c3ho.blogspot.com/feeds/posts/default/-/open-source');
  expect(data[data.length - 1].title).toBe('First Post!');
});

test('Passing an invalid RSS feed URI should error', async () => {
  await expect(feedParser('c3ho.blogspot.com/feeds/posts/default/-/open-source')).rejects.toThrow('error');
});

test('Passing a valid URI, but not a feed URI should error', async () => {
  await expect(feedParser('https://google.ca')).rejects.toThrow('Not a feed');
});

const assertValidFeed = (feed) => {
  expect(Array.isArray(feed)).toBeTruthy();
  expect(feed.length > 0).toBeTruthy();
};


test('Non existant feed failure case.', async () => {
  try {
    await feedParser('http://doesnotexists___.com');
  } catch (err) {
    expect(err.message).toBe('getaddrinfo ENOTFOUND doesnotexists___.com doesnotexists___.com:80');
  }
});

test('Not a feed failure case', async () => {
  try {
    const nonFeedURL = 'https://kerleysblog.blogspot.com';
    await feedParser(nonFeedURL);
  } catch (err) {
    expect(err.message).toBe('Not a feed');
  }
});

test('Blogger feed success case', async () => {
  const validFeed = 'https://kerleysblog.blogspot.com/feeds/posts/default?alt=rss';
  const feed = await feedParser(validFeed);
  assertValidFeed(feed);
});

test('Wordpress site feed success case', async () => {
  const validFeed = 'https://medium.com/feed/@Medium';
  const feed = await feedParser(validFeed);
  assertValidFeed(feed);
});
