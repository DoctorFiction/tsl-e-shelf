import { getChapterFromCfi, getPageFromCfi } from '../epub-utils';

describe('epub-utils', () => {
  let mockBook: any;

  beforeEach(() => {
    mockBook = {
      navigation: {
        toc: [
          { href: 'chapter1.html', label: 'Chapter 1' },
          { href: 'chapter2.html', label: 'Chapter 2' },
        ],
      },
      spine: {
        get: jest.fn((cfi) => {
          if (cfi.includes('chapter1')) return Promise.resolve({ href: 'chapter1.html' });
          if (cfi.includes('chapter2')) return Promise.resolve({ href: 'chapter2.html' });
          return Promise.resolve(null);
        }),
      },
      locations: {
        length: jest.fn(() => 100),
        locationFromCfi: jest.fn((cfi) => {
          if (cfi.includes('page10')) return 9; // 0-indexed
          return 0;
        }),
      },
      ready: Promise.resolve(),
    };
  });

  describe('getChapterFromCfi', () => {
    it('should return the correct chapter label for a given CFI', async () => {
      const cfi = 'epubcfi(/6/2[chapter1]/4/2)';
      const chapter = await getChapterFromCfi(mockBook, cfi);
      expect(chapter).toBe('Chapter 1');
    });

    it('should return null if chapter not found', async () => {
      const cfi = 'epubcfi(/6/2[unknown]/4/2)';
      const chapter = await getChapterFromCfi(mockBook, cfi);
      expect(chapter).toBeNull();
    });

    it('should handle book.navigation being not ready', async () => {
      mockBook.navigation = null;

      mockBook.ready = new Promise((resolve) => {
        setTimeout(() => {
          mockBook.navigation = {
            toc: [
              { href: 'chapter1.html', label: 'Chapter 1' },
              { href: 'chapter2.html', label: 'Chapter 2' },
            ],
          };
          resolve(true);
        }, 10);
      });

      const cfi = 'epubcfi(/6/2[chapter1]/4/2)';
      const chapter = await getChapterFromCfi(mockBook, cfi);
      expect(chapter).toBe('Chapter 1');
    });
  });

  describe('getPageFromCfi', () => {
    it('should return the correct 1-indexed page number for a given CFI', () => {
      const cfi = 'epubcfi(/6/2[chapter1]/4/2/page10)';
      const page = getPageFromCfi(mockBook, cfi);
      expect(page).toBe(10);
    });

    it('should return null if locations are not generated', () => {
      mockBook.locations.length.mockReturnValue(0);
      const cfi = 'epubcfi(/6/2[chapter1]/4/2)';
      const page = getPageFromCfi(mockBook, cfi);
      expect(page).toBeNull();
    });
  });
});
