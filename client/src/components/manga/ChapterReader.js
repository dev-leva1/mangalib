import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getMangaById } from '../../actions/manga';
import { getChapter } from '../../actions/chapter';
import Spinner from '../layout/Spinner';

const ReaderContainer = styled.div`
  padding: 1rem 0;
`;

const ReaderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const MangaTitle = styled(Link)`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${props => props.theme.textPrimary};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.accent};
  }
`;

const ChapterTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.textPrimary};
`;

const NavigationControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.backgroundLight};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  color: ${props => props.theme.textPrimary};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.backgroundLighter};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChapterSelect = styled.select`
  padding: 0.5rem;
  background-color: ${props => props.theme.backgroundLight};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  color: ${props => props.theme.textPrimary};
`;

const ReaderSettings = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SettingsGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const SettingButton = styled.button`
  padding: 0.5rem;
  background-color: ${props => props.active ? props.theme.accent : props.theme.backgroundLight};
  color: ${props => props.active ? 'white' : props.theme.textPrimary};
  border: 1px solid ${props => props.active ? props.theme.accent : props.theme.border};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.accentDark : props.theme.backgroundLighter};
  }
`;

const PagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const PageImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChapterReader = ({ 
  getMangaById, 
  getChapter, 
  manga: { manga, loading: mangaLoading }, 
  chapter: { chapter, loading: chapterLoading } 
}) => {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();
  
  const [readingMode, setReadingMode] = useState('vertical'); // vertical, horizontal, webtoon
  
  useEffect(() => {
    getMangaById(mangaId);
    getChapter(chapterId);
  }, [getMangaById, getChapter, mangaId, chapterId]);
  
  const handleChapterChange = (e) => {
    navigate(`/manga/${mangaId}/chapter/${e.target.value}`);
  };
  
  const navigateToPrevChapter = () => {
    if (!manga || !chapter) return;
    
    const currentIndex = manga.chapters.findIndex(ch => ch._id === chapter._id);
    if (currentIndex > 0) {
      navigate(`/manga/${mangaId}/chapter/${manga.chapters[currentIndex - 1]._id}`);
    }
  };
  
  const navigateToNextChapter = () => {
    if (!manga || !chapter) return;
    
    const currentIndex = manga.chapters.findIndex(ch => ch._id === chapter._id);
    if (currentIndex < manga.chapters.length - 1) {
      navigate(`/manga/${mangaId}/chapter/${manga.chapters[currentIndex + 1]._id}`);
    }
  };
  
  if (mangaLoading || chapterLoading || !manga || !chapter) {
    return <Spinner />;
  }
  
  const currentChapterIndex = manga.chapters.findIndex(ch => ch._id === chapter._id);
  const hasPrevChapter = currentChapterIndex > 0;
  const hasNextChapter = currentChapterIndex < manga.chapters.length - 1;
  
  return (
    <ReaderContainer>
      <ReaderHeader>
        <MangaTitle to={`/manga/${mangaId}`}>{manga.title}</MangaTitle>
        
        <NavigationControls>
          <NavButton 
            onClick={navigateToPrevChapter} 
            disabled={!hasPrevChapter}
          >
            Предыдущая
          </NavButton>
          
          <ChapterSelect value={chapter._id} onChange={handleChapterChange}>
            {manga.chapters.map(ch => (
              <option key={ch._id} value={ch._id}>
                Глава {ch.number}: {ch.title}
              </option>
            ))}
          </ChapterSelect>
          
          <NavButton 
            onClick={navigateToNextChapter} 
            disabled={!hasNextChapter}
          >
            Следующая
          </NavButton>
        </NavigationControls>
      </ReaderHeader>
      
      <ChapterTitle>Глава {chapter.number}: {chapter.title}</ChapterTitle>
      
      <ReaderSettings>
        <SettingsGroup>
          <SettingButton 
            active={readingMode === 'vertical'} 
            onClick={() => setReadingMode('vertical')}
          >
            Вертикальный режим
          </SettingButton>
          <SettingButton 
            active={readingMode === 'horizontal'} 
            onClick={() => setReadingMode('horizontal')}
          >
            Горизонтальный режим
          </SettingButton>
          <SettingButton 
            active={readingMode === 'webtoon'} 
            onClick={() => setReadingMode('webtoon')}
          >
            Веб-тун
          </SettingButton>
        </SettingsGroup>
      </ReaderSettings>
      
      <PagesContainer>
        {chapter.pages.map((page, index) => (
          <PageImage key={index} src={page} alt={`Страница ${index + 1}`} />
        ))}
      </PagesContainer>
      
      <ReaderHeader>
        <NavigationControls>
          <NavButton 
            onClick={navigateToPrevChapter} 
            disabled={!hasPrevChapter}
          >
            Предыдущая глава
          </NavButton>
          
          <NavButton 
            onClick={navigateToNextChapter} 
            disabled={!hasNextChapter}
          >
            Следующая глава
          </NavButton>
        </NavigationControls>
      </ReaderHeader>
    </ReaderContainer>
  );
};

const mapStateToProps = state => ({
  manga: state.manga,
  chapter: state.chapter
});

export default connect(mapStateToProps, { getMangaById, getChapter })(ChapterReader); 