import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
`;

const MangaCard = styled.div`
  background-color: ${props => props.theme.backgroundLight};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const MangaCover = styled.div`
  height: 280px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const MangaInfo = styled.div`
  padding: 1rem;
`;

const MangaTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.textPrimary};
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.5rem;
`;

const MangaDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const MangaStatus = styled.span`
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
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

const MangaGrid = ({ manga }) => {
  if (!manga || manga.length === 0) {
    return <p>Манга не найдена</p>;
  }

  return (
    <Grid>
      {manga.map(item => (
        <MangaCard key={item._id}>
          <Link to={`/manga/${item._id}`}>
            <MangaCover>
              <img src={item.coverImage} alt={item.title} />
            </MangaCover>
            <MangaInfo>
              <MangaTitle>{item.title}</MangaTitle>
              <MangaDetails>
                <span>{item.chapters.length} глав</span>
                <MangaStatus status={item.status}>{item.status}</MangaStatus>
              </MangaDetails>
            </MangaInfo>
          </Link>
        </MangaCard>
      ))}
    </Grid>
  );
};

export default MangaGrid; 