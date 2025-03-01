import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getMangaById } from '../../actions/manga';
import Spinner from '../layout/Spinner';

const MangaDetailContainer = styled.div`
  padding: 2rem 0;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.accent};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MangaHeader = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CoverImage = styled.img`
  width: 250px;
  height: 350px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 250px;
    margin: 0 auto;
  }
`;

const MangaInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.textPrimary};
`;

const AlternativeTitles = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  background-color: ${props => {
    switch(props.status) {
      case 'Выпускается': return props.theme.success + '33';
      case 'Завершено': return props.theme.info + '33';
      case 'Анонс': return props.theme.warning + '33';
      default: return props.theme.secondary + '33';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'Выпускается': return props.theme.success;
      case 'Завершено': return props.theme.info;
      case 'Анонс': return props.theme.warning;
      default: return props.theme.secondary;
    }
  }};
`;

const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Genre = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: ${props => props.theme.backgroundLight};
  color: ${props => props.theme.textSecondary};
`;

const Description = styled.div`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: ${props => props.theme.textPrimary};
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  
  tr:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.border};
  }
  
  td {
    padding: 0.7rem 0;
  }
  
  td:first-child {
    width: 150px;
    color: ${props => props.theme.textSecondary};
  }
`;

const ReadButton = styled(Link)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.theme.accent};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  margin-right: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.accentDark};
  }
`;

const BookmarkButton = styled.button`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: transparent;
  color: ${props => props.theme.accent};
  border: 1px solid ${props => props.theme.accent};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.accent + '11'};
  }
`;

const ChaptersSection = styled.div`
  margin-top: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.textPrimary};
`;

const ChaptersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ChapterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundLight};
  border-radius: 4px;
  
  &:hover {
    background-color: ${props => props.theme.backgroundLighter};
  }
`;

const ChapterLink = styled(Link)`
  color: ${props => props.theme.textPrimary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: ${props => props.theme.accent};
  }
`;

const ChapterDate = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const MangaDetail = ({ getMangaById, manga: { manga, loading } }) => {
  const { id } = useParams();
  
  useEffect(() => {
    getMangaById(id);
  }, [getMangaById, id]);
  
  if (loading || !manga) {
    return <Spinner />;
  }
  
  return (
    <MangaDetailContainer>
      <BackLink to="/catalog">← Вернуться к каталогу</BackLink>
      
      <MangaHeader>
        <CoverImage src={manga.coverImage} alt={manga.title} />
        
        <MangaInfo>
          <Title>{manga.title}</Title>
          
          {manga.alternativeTitles && (
            <AlternativeTitles>
              {manga.alternativeTitles.join(' / ')}
            </AlternativeTitles>
          )}
          
          <StatusBadge status={manga.status}>{manga.status}</StatusBadge>
          
          <GenresList>
            {manga.genres.map((genre, index) => (
              <Genre key={index}>{genre}</Genre>
            ))}
          </GenresList>
          
          <Description>{manga.description}</Description>
          
          <InfoTable>
            <tbody>
              <tr>
                <td>Автор</td>
                <td>{manga.author}</td>
              </tr>
              <tr>
                <td>Художник</td>
                <td>{manga.artist}</td>
              </tr>
              <tr>
                <td>Год выпуска</td>
                <td>{manga.releaseYear}</td>
              </tr>
              <tr>
                <td>Издатель</td>
                <td>{manga.publisher}</td>
              </tr>
            </tbody>
          </InfoTable>
          
          <div>
            {manga.chapters && manga.chapters.length > 0 && (
              <ReadButton to={`/manga/${manga._id}/chapter/${manga.chapters[0]._id}`}>
                Читать
              </ReadButton>
            )}
            <BookmarkButton>Добавить в закладки</BookmarkButton>
          </div>
        </MangaInfo>
      </MangaHeader>
      
      <ChaptersSection>
        <SectionTitle>Главы</SectionTitle>
        
        {manga.chapters && manga.chapters.length > 0 ? (
          <ChaptersList>
            {manga.chapters.map(chapter => (
              <ChapterItem key={chapter._id}>
                <ChapterLink to={`/manga/${manga._id}/chapter/${chapter._id}`}>
                  Глава {chapter.number}: {chapter.title}
                </ChapterLink>
                <ChapterDate>
                  {new Date(chapter.releaseDate).toLocaleDateString()}
                </ChapterDate>
              </ChapterItem>
            ))}
          </ChaptersList>
        ) : (
          <p>Главы еще не добавлены</p>
        )}
      </ChaptersSection>
    </MangaDetailContainer>
  );
};

const mapStateToProps = state => ({
  manga: state.manga
});

export default connect(mapStateToProps, { getMangaById })(MangaDetail); 