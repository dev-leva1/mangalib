import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getPopularManga, getLatestManga } from '../../actions/manga';
import MangaGrid from '../manga/MangaGrid';
import Spinner from '../layout/Spinner';

const HomeContainer = styled.div`
  padding: 2rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  border-bottom: 2px solid ${({ theme }) => theme.primary};
  padding-bottom: 0.5rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const Home = ({
  manga: { popularManga, latestManga, loading },
  getPopularManga,
  getLatestManga
}) => {
  useEffect(() => {
    getPopularManga();
    getLatestManga();
  }, [getPopularManga, getLatestManga]);

  return loading ? (
    <Spinner />
  ) : (
    <HomeContainer>
      <Section>
        <SectionTitle>Популярная манга</SectionTitle>
        <MangaGrid manga={popularManga} />
      </Section>
      <Section>
        <SectionTitle>Последние обновления</SectionTitle>
        <MangaGrid manga={latestManga} />
      </Section>
    </HomeContainer>
  );
};

Home.propTypes = {
  getPopularManga: PropTypes.func.isRequired,
  getLatestManga: PropTypes.func.isRequired,
  manga: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  manga: state.manga
});

export default connect(mapStateToProps, { getPopularManga, getLatestManga })(Home); 