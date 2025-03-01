import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getChapter } from '../../actions/chapter';
import { updateReadingProgress } from '../../actions/profile';
import { getMangaDetail } from '../../actions/manga';
import Spinner from '../layout/Spinner';

const ReaderContainer = styled.div`
  padding: 1rem 0;
  max-width: 1000px;
  margin: 0 auto;
`;

const ReaderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const MangaInfo = styled.div`
  display: flex;
  align-items: center;
`;

const MangaTitle = styled(Link)`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ChapterTitle = styled.span`
  margin-left: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  
  &:before {
    content: '|';
    margin-right: 1rem;
    color: ${({ theme }) => theme.border};
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const PrevButton = styled(NavButton)`
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const NextButton = styled(NavButton)`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  
  svg {
    margin-left: 0.5rem;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const ReaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const PageImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ReaderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const PageCounter = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
`;

const ChapterReader = ({
  manga: { mangaDetail, loading: mangaLoading },
  chapter: { chapter, chapters, loading: chapterLoading },
  auth: { isAuthenticated },
  getChapter,
  getMangaDetail,
  updateReadingProgress
}) => {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getChapter(chapterId);
    getMangaDetail(mangaId);
    
    // Update reading progress if user is authenticated
    if (isAuthenticated) {
      updateReadingProgress(mangaId, chapterId);
    }
    
    // Reset to first page when changing chapters
    setCurrentPage(1);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [getChapter, getMangaDetail, updateReadingProgress, mangaId, chapterId, isAuthenticated]);

  if (chapterLoading || mangaLoading || !chapter || !mangaDetail) {
    return <Spinner />;
  }

  const { title: mangaTitle } = mangaDetail;
  const { title: chapterTitle, pages } = chapter;

  // Find current chapter index to determine prev/next chapters
  const currentChapterIndex = chapters.findIndex(ch => ch._id === chapterId);
  const prevChapter = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;
  const nextChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;

  const handleKeyDown = (e) => {
    // Left arrow key - previous page
    if (e.keyCode === 37) {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (prevChapter) {
        navigate(`/manga/${mangaId}/chapter/${prevChapter._id}`);
      }
    }
    // Right arrow key - next page
    else if (e.keyCode === 39) {
      if (currentPage < pages.length) {
        setCurrentPage(currentPage + 1);
      } else if (nextChapter) {
        navigate(`/manga/${mangaId}/chapter/${nextChapter._id}`);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <ReaderContainer>
      <ReaderHeader>
        <MangaInfo>
          <MangaTitle to={`/manga/${mangaId}`}>{mangaTitle}</MangaTitle>
          <ChapterTitle>{chapterTitle}</ChapterTitle>
        </MangaInfo>
        <NavigationButtons>
          <PrevButton
            to={prevChapter ? `/manga/${mangaId}/chapter/${prevChapter._id}` : '#'}
            className={!prevChapter ? 'disabled' : ''}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
            Предыдущая глава
          </PrevButton>
          <NextButton
            to={nextChapter ? `/manga/${mangaId}/chapter/${nextChapter._id}` : '#'}
            className={!nextChapter ? 'disabled' : ''}
          >
            Следующая глава
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </NextButton>
        </NavigationButtons>
      </ReaderHeader>

      <ReaderContent>
        {pages && pages.length > 0 && (
          <PageImage
            src={pages[currentPage - 1]}
            alt={`Страница ${currentPage}`}
            onClick={() => {
              if (currentPage < pages.length) {
                setCurrentPage(currentPage + 1);
              } else if (nextChapter) {
                navigate(`/manga/${mangaId}/chapter/${nextChapter._id}`);
              }
            }}
          />
        )}
      </ReaderContent>

      <ReaderFooter>
        <PageCounter>
          Страница {currentPage} из {pages ? pages.length : 0}
        </PageCounter>
        <NavigationButtons>
          <PrevButton
            as="button"
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              } else if (prevChapter) {
                navigate(`/manga/${mangaId}/chapter/${prevChapter._id}`);
              }
            }}
            disabled={currentPage === 1 && !prevChapter}
            className={currentPage === 1 && !prevChapter ? 'disabled' : ''}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
            Предыдущая
          </PrevButton>
          <NextButton
            as="button"
            onClick={() => {
              if (currentPage < pages.length) {
                setCurrentPage(currentPage + 1);
              } else if (nextChapter) {
                navigate(`/manga/${mangaId}/chapter/${nextChapter._id}`);
              }
            }}
            disabled={currentPage === pages.length && !nextChapter}
            className={currentPage === pages.length && !nextChapter ? 'disabled' : ''}
          >
            Следующая
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </NextButton>
        </NavigationButtons>
      </ReaderFooter>
    </ReaderContainer>
  );
};

ChapterReader.propTypes = {
  manga: PropTypes.object.isRequired,
  chapter: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getChapter: PropTypes.func.isRequired,
  getMangaDetail: PropTypes.func.isRequired,
  updateReadingProgress: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  manga: state.manga,
  chapter: state.chapter,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getChapter,
  getMangaDetail,
  updateReadingProgress
})(ChapterReader); 