<template>
  <section class="lag-news">
    <header class="lag-hero">
      <div class="hero-decoration">
        <span class="deco-symbol">✦</span>
        <span class="deco-line"></span>
        <span class="deco-symbol">◈</span>
        <span class="deco-line"></span>
        <span class="deco-symbol">✦</span>
      </div>
      
      <h1 class="lag-title">Noticias BRANA</h1>
      <p class="lag-sub">Tendencias y lanzamientos.</p>

      <div class="lag-toolbar">
        <el-input
          v-model="q"
          placeholder="Buscar noticias..."
          clearable
          @clear="applyFilters"
          @input="debouncedApply()"
          :prefix-icon="Search"
          class="search-input"
        />
        <el-select
          v-model="tag"
          placeholder="Filtrar por etiqueta"
          clearable
          @change="applyFilters"
          class="filter-select"
        >
          <el-option v-for="t in availableTags" :key="t" :label="t" :value="t" />
        </el-select>
      </div>
    </header>

    <el-skeleton v-if="loading" :rows="6" animated class="lag-skeleton" />

    <div v-else class="news-content">
      <div v-if="pagedNews.length" class="cards">
        <article 
          v-for="(item, index) in pagedNews" 
          :key="item.id" 
          class="lag-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="img-wrap" v-if="item.image">
            <img :src="item.image" :alt="item.title" loading="lazy" />
            <div class="img-overlay"></div>
          </div>
          <div class="content">
            <h2 class="card-title">{{ item.title }}</h2>
            <p class="meta">
              <span class="date">{{ formatDate(item.date) }}</span>
              <span v-if="item.author" class="author"> · Por {{ item.author }}</span>
            </p>
            <p class="excerpt">{{ item.excerpt }}</p>
            <div class="tags">
              <el-tag
                v-for="t in item.tags"
                :key="t"
                size="small"
                class="lag-tag"
                effect="dark"
              >
                {{ t }}
              </el-tag>
            </div>
            <div class="cta">
              <button class="read-more-btn" @click="openItem(item)">
                <span>Leer más</span>
                <span class="arrow">→</span>
              </button>
            </div>
          </div>
        </article>
      </div>

      <el-empty
        v-else
        description="No encontramos noticias con esos filtros."
        class="lag-empty"
      />

      <div v-if="filtered.length" class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="filtered.length"
          :current-page="page"
          @current-change="(p:number)=>page=p"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

type NewsItem = {
  id: string | number
  title: string
  date: string // ISO
  excerpt: string
  content?: string
  image?: string
  author?: string
  tags: string[]
  slug?: string
  url?: string
}

const news = ref<NewsItem[]>([])
const loading = ref(true)
const q = ref('')
const tag = ref<string | null>(null)
const page = ref(1)
const pageSize = 6

// Obtener tags disponibles
const availableTags = computed(() => {
  const s = new Set<string>()
  news.value.forEach(n => n.tags?.forEach(t => s.add(t)))
  return Array.from(s).sort()
})

// Filtro
const filtered = ref<NewsItem[]>([])
function applyFilters() {
  const term = q.value.trim().toLowerCase()
  const t = tag.value
  let list = news.value.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date))
  if (term) {
    list = list.filter(n =>
      [n.title, n.excerpt, n.author, n.tags?.join(' ')].join(' ').toLowerCase().includes(term)
    )
  }
  if (t) {
    list = list.filter(n => n.tags?.includes(t))
  }
  filtered.value = list
  page.value = 1
}

// Paginación
const pagedNews = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

// Debounce simple para el buscador
let debounceTimer: number | undefined
function debouncedApply(ms = 250) {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(applyFilters, ms)
}

// Formato de fecha (Argentina)
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function openItem(item: NewsItem) {
  if (item.url) {
    window.open(item.url, '_blank', 'noopener')
    return
  }
  // Si tienes router y slug, navega:
  // router.push({ name: 'noticia', params: { slug: item.slug } })
  ElMessage.info('Pronto: vista de detalle 👀')
}

async function fetchNews() {
  loading.value = true
  try {
    // Ajusta el endpoint a tu backend real
    const res = await fetch('/api/noticias', { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = (await res.json()) as NewsItem[]
    news.value = Array.isArray(data) ? data : []
  } catch (err) {
    // Fallback mock si falla la API
    console.warn('Fallo /api/noticias; usando mock', err)
    news.value = [
      {
        id: 1,
        title: 'Colección "Nocturna" FW25',
        date: '2025-08-15',
        excerpt:
          'Presentamos texturas pesadas, cuero vegano y siluetas afiladas para dominar la noche.',
        image:
          'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1400&auto=format&fit=crop',
        author: 'Equipo BRANA',
        tags: ['lanzamientos', 'colecciones', 'místico'],
        url: 'https://www.instagram.com/brana_eg/',
      },
      {
        id: 2,
        title: 'Guía: cómo armar un total black con capas',
        date: '2025-08-10',
        excerpt:
          'Capas, proporciones y accesorios para un look monolítico con presencia.',
        image:
          'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop',
        author: 'BRANA Studio',
        tags: ['guías', 'estilo'],
      },
      {
        id: 3,
        title: 'Backstage del desfile "Ceniza & Carmesí"',
        date: '2025-07-29',
        excerpt:
          'Un vistazo íntimo a la preparación del show más oscuro del año.',
        image:
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop',
        author: 'BRANA Studio',
        tags: ['eventos', 'desfiles'],
      },
    ]
  } finally {
    applyFilters()
    loading.value = false
  }
}

onMounted(fetchNews)
</script>

<style scoped>
/* Variables */
.lag-news {
  --gold: #DAA520;
  --gold-light: #FFD700;
  --bg-dark: #0a0a0a;
  --bg-card: #1a1a1a;
}

/* Container principal */
.lag-news {
  min-height: 100vh;
  background: var(--bg-dark);
  padding: 8rem 2rem 4rem;
  position: relative;
}

/* Hero Header */
.lag-hero {
  max-width: 1200px;
  margin: 0 auto 5rem;
  text-align: center;
  position: relative;
}

.hero-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  opacity: 0.6;
}

.deco-symbol {
  font-size: 1.2rem;
  color: var(--gold);
  animation: symbolRotate 8s linear infinite;
}

.deco-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

@keyframes symbolRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.lag-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  color: var(--gold);
  margin: 0 0 1rem 0;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(218, 165, 32, 0.3);
  animation: titlePulse 3s ease-in-out infinite;
}

@keyframes titlePulse {
  0%, 100% { text-shadow: 0 0 30px rgba(218, 165, 32, 0.3); }
  50% { text-shadow: 0 0 50px rgba(218, 165, 32, 0.5); }
}

.lag-sub {
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 3rem 0;
  letter-spacing: 0.05em;
}

/* Toolbar */
.lag-toolbar {
  display: flex;
  gap: 1rem;
  max-width: 700px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

.filter-select {
  min-width: 200px;
}

/* Estilos Element Plus personalizados */
:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(218, 165, 32, 0.3);
  border-radius: 8px;
  box-shadow: none;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  border-color: var(--gold);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 15px rgba(218, 165, 32, 0.2);
}

:deep(.el-input__inner) {
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.9rem;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

:deep(.el-select .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(218, 165, 32, 0.3);
}

/* Content */
.news-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Grid de cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;
}

/* Card individual */
.lag-card {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(218, 165, 32, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lag-card:hover {
  border-color: var(--gold);
  transform: translateY(-8px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(218, 165, 32, 0.3);
}

/* Imagen */
.img-wrap {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.lag-card:hover .img-wrap img {
  transform: scale(1.1);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lag-card:hover .img-overlay {
  opacity: 1;
}

/* Contenido */
.content {
  padding: 2rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1rem 0;
  letter-spacing: 0.02em;
  line-height: 1.3;
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
}

.date {
  color: var(--gold);
}

.author {
  color: rgba(255, 255, 255, 0.6);
}

.excerpt {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 1.5rem 0;
}

/* Tags */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

:deep(.lag-tag) {
  background: rgba(218, 165, 32, 0.1);
  border-color: rgba(218, 165, 32, 0.3);
  color: var(--gold);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.3rem 0.8rem;
}

/* Botón */
.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 2rem;
  background: transparent;
  border: 2px solid var(--gold);
  border-radius: 50px;
  color: var(--gold);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.read-more-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.3), transparent);
  transition: left 0.5s ease;
}

.read-more-btn:hover::before {
  left: 100%;
}

.read-more-btn:hover {
  background: rgba(218, 165, 32, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(218, 165, 32, 0.3);
}

.read-more-btn .arrow {
  transition: transform 0.3s ease;
}

.read-more-btn:hover .arrow {
  transform: translateX(5px);
}

/* Empty State */
:deep(.lag-empty) {
  padding: 4rem 2rem;
}

:deep(.lag-empty .el-empty__description) {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  padding: 2rem 0;
}

:deep(.el-pagination) {
  gap: 0.5rem;
}

:deep(.el-pagination button),
:deep(.el-pagination .el-pager li) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(218, 165, 32, 0.3);
  color: rgba(255, 255, 255, 0.7);
  min-width: 40px;
  height: 40px;
  border-radius: 8px;
  font-weight: 600;
}

:deep(.el-pagination button:hover),
:deep(.el-pagination .el-pager li:hover) {
  background: rgba(218, 165, 32, 0.1);
  border-color: var(--gold);
  color: var(--gold);
}

:deep(.el-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  border-color: var(--gold);
  color: #000;
}

/* Skeleton */
:deep(.lag-skeleton) {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Tablet (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .lag-news {
    padding: 6rem 1.5rem 3rem;
  }

  .lag-hero {
    margin-bottom: 4rem;
  }

  .lag-title {
    font-size: clamp(2rem, 5vw, 3rem);
  }

  .cards {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .img-wrap {
    height: 220px;
  }

  .content {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.3rem;
  }
}

/* Móvil (<= 640px) */
@media (max-width: 640px) {
  .lag-news {
    padding: 4rem 1.5rem 2rem;
  }

  .lag-hero {
    margin-bottom: 3rem;
  }

  .hero-decoration {
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .deco-symbol {
    font-size: 1rem;
  }

  .deco-line {
    width: 40px;
  }

  .lag-title {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
    letter-spacing: 0.15em;
    margin-bottom: 0.75rem;
  }

  .lag-sub {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .lag-toolbar {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-input,
  .filter-select {
    width: 100%;
    min-width: 0;
  }

  .cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .img-wrap {
    height: 200px;
  }

  .content {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
  }

  .meta {
    font-size: 0.8rem;
    flex-wrap: wrap;
  }

  .excerpt {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }

  .tags {
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  :deep(.lag-tag) {
    font-size: 0.7rem;
    padding: 0.25rem 0.6rem;
  }

  .read-more-btn {
    width: 100%;
    padding: 0.85rem 1.5rem;
    font-size: 0.85rem;
    justify-content: center;
  }

  .pagination {
    margin-top: 2rem;
  }

  :deep(.el-pagination button),
  :deep(.el-pagination .el-pager li) {
    min-width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
}

/* Móvil Pequeño (<= 375px) */
@media (max-width: 375px) {
  .lag-news {
    padding: 3rem 1rem 2rem;
  }

  .lag-title {
    font-size: 1.6rem;
  }

  .cards {
    gap: 1.2rem;
  }

  .img-wrap {
    height: 180px;
  }

  .content {
    padding: 1.2rem;
  }

  .card-title {
    font-size: 1.1rem;
  }
}
</style>