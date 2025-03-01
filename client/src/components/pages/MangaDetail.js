import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getMangaDetail, clearManga } from '../../actions/manga';
import { getChapters } from '../../actions/chapter';
import { addFavorite, removeFavorite } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import ChapterList from '../manga/ChapterList';

const MangaDetailContainer = styled.div`
  padding: 2rem 0;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 2rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const MangaHeader = styled.div`
  display: flex;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MangaCover = styled.div`
  width: 250px;
  height: 350px;
  margin-right: 2rem;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    margin: 0 auto 2rem;
  }
`;

const MangaInfo = styled.div`
  flex: 1;
`;

const MangaTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const MangaAlternativeTitles = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 1rem;
  font-style: italic;
`;

const MangaMeta = styled.div`
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  margin-bottom: 0.5rem;
  
  span {
    font-weight: bold;
    color: ${({ theme }) => theme.text};
  }
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Genre = styled.span`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const MangaDescription = styled.div`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.text};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryLight};
  }
  
  &.active {
    background-color: ${({ theme }) => theme.primaryLight};
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  border-bottom: 2px solid ${({ theme }) => theme.primary};
  padding-bottom: 0.5rem;
`;

const MangaDetail = ({
  manga: { mangaDetail, loading: mangaLoading },
  chapter: { chapters, loading: chapterLoading },
  profile: { favorites },
  auth: { isAuthenticated },
  getMangaDetail,
  getChapters,
  clearManga,
  addFavorite,
  removeFavorite
}) => {
  const { id } = useParams();

  useEffect(() => {
    getMangaDetail(id);
    getChapters(id);

    return () => {
      clearManga();
    };
  }, [getMangaDetail, getChapters, clearManga, id]);

  if (mangaLoading || chapterLoading || !mangaDetail) {
    return <Spinner />;
  }

  const {
    _id,
    title,
    alternativeTitles,
    cover,
    description,
    author,
    artist,
    status,
    releaseYear,
    genres
  } = mangaDetail;

  const isFavorite = favorites && favorites.some((fav) => fav._id === _id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(_id);
    } else {
      addFavorite(_id);
    }
  };

  return (
    <MangaDetailContainer>
      <BackLink to="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
        Назад к списку
      </BackLink>

      <MangaHeader>
        <MangaCover>
          <img src={cover} alt={title} />
        </MangaCover>
        <MangaInfo>
          <MangaTitle>{title}</MangaTitle>
          {alternativeTitles && (
            <MangaAlternativeTitles>
              {alternativeTitles.join(' / ')}
            </MangaAlternativeTitles>
          )}

          <MangaMeta>
            {author && (
              <MetaItem>
                <span>Автор:</span> {author}
              </MetaItem>
            )}
            {artist && (
              <MetaItem>
                <span>Художник:</span> {artist}
              </MetaItem>
            )}
            {status && (
              <MetaItem>
                <span>Статус:</span> {status}
              </MetaItem>
            )}
            {releaseYear && (
              <MetaItem>
                <span>Год выпуска:</span> {releaseYear}
              </MetaItem>
            )}
          </MangaMeta>

          {genres && genres.length > 0 && (
            <GenreList>
              {genres.map((genre, index) => (
                <Genre key={index}>{genre}</Genre>
              ))}
            </GenreList>
          )}

          <MangaDescription>
            <p>{description}</p>
          </MangaDescription>

          <ActionButtons>
            {chapters && chapters.length > 0 && (
              <PrimaryButton as={Link} to={`/manga/${_id}/chapter/${chapters[0]._id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                </svg>
                Начать чтение
              </PrimaryButton>
            )}
            {isAuthenticated && (
              <OutlineButton
                onClick={handleFavoriteToggle}
                className={isFavorite ? 'active' : ''}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>
                {isFavorite ? 'В избранном' : 'Добавить в избранное'}
              </OutlineButton>
            )}
          </ActionButtons>
        </MangaInfo>
      </MangaHeader>

      <SectionTitle>Главы</SectionTitle>
      <ChapterList mangaId={_id} chapters={chapters} />
    </MangaDetailContainer>
  );
};

MangaDetail.propTypes = {
  manga: PropTypes.object.isRequired,
  chapter: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getMangaDetail: PropTypes.func.isRequired,
  getChapters: PropTypes.func.isRequired,
  clearManga: PropTypes.func.isRequired,
  addFavorite: PropTypes.func.isRequired,
  removeFavorite: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  manga: state.manga,
  chapter: state.chapter,
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getMangaDetail,
  getChapters,
  clearManga,
  addFavorite,
  removeFavorite
})(MangaDetail); 