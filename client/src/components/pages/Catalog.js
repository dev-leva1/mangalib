import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getAllManga } from '../../actions/manga';
import MangaGrid from '../manga/MangaGrid';
import Spinner from '../layout/Spinner';

const CatalogContainer = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.textPrimary};
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.backgroundLight};
  color: ${props => props.theme.textPrimary};
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.backgroundLight};
  color: ${props => props.theme.textPrimary};
  flex-grow: 1;
`;

const Catalog = ({ manga: { manga, loading }, getAllManga }) => {
  const [filters, setFilters] = useState({
    genre: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    getAllManga();
  }, [getAllManga]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredManga = manga.filter(item => {
    // Фильтрация по жанру
    if (filters.genre && !item.genres.includes(filters.genre)) {
      return false;
    }
    
    // Фильтрация по статусу
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    
    // Фильтрация по поиску
    if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return loading ? (
    <Spinner />
  ) : (
    <CatalogContainer>
      <Title>Каталог манги</Title>
      
      <FiltersContainer>
        <SearchInput 
          type="text" 
          placeholder="Поиск по названию..." 
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
        />
        
        <FilterSelect 
          name="genre" 
          value={filters.genre} 
          onChange={handleFilterChange}
        >
          <option value="">Все жанры</option>
          <option value="Сёнэн">Сёнэн</option>
          <option value="Сёдзё">Сёдзё</option>
          <option value="Сэйнэн">Сэйнэн</option>
          <option value="Фэнтези">Фэнтези</option>
          <option value="Боевик">Боевик</option>
          <option value="Романтика">Романтика</option>
        </FilterSelect>
        
        <FilterSelect 
          name="status" 
          value={filters.status} 
          onChange={handleFilterChange}
        >
          <option value="">Все статусы</option>
          <option value="Выпускается">Выпускается</option>
          <option value="Завершено">Завершено</option>
          <option value="Анонс">Анонс</option>
        </FilterSelect>
      </FiltersContainer>
      
      <MangaGrid manga={filteredManga} />
    </CatalogContainer>
  );
};

const mapStateToProps = state => ({
  manga: state.manga
});

export default connect(mapStateToProps, { getAllManga })(Catalog); 