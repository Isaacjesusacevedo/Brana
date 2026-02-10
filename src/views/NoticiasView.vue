<template>
  <section class="lag-news">
    <header class="lag-hero">
      <h1 class="lag-title">Noticias LAG</h1>
      <p class="lag-sub">Tendencias, lanzamientos y rituales de estilo dark.</p>

      <div class="lag-toolbar">
        <el-input
          v-model="q"
          placeholder="Buscar noticias..."
          clearable
          @clear="applyFilters"
          @input="debouncedApply()"
          :prefix-icon="Search"
        />
        <el-select
          v-model="tag"
          placeholder="Filtrar por etiqueta"
          clearable
          @change="applyFilters"
        >
          <el-option v-for="t in availableTags" :key="t" :label="t" :value="t" />
        </el-select>
      </div>
    </header>

    <el-skeleton v-if="loading" :rows="6" animated class="lag-skeleton" />

    <div v-else>
      <div v-if="pagedNews.length" class="cards">
        <article v-for="item in pagedNews" :key="item.id" class="lag-card">
          <div class="img-wrap" v-if="item.image">
            <img :src="item.image" :alt="item.title" loading="lazy" />
          </div>
          <div class="content">
            <h2 class="card-title">
              {{ item.title }}
            </h2>
            <p class="meta">
              <span>{{ formatDate(item.date) }}</span>
              <span v-if="item.author"> · Por {{ item.author }}</span>
            </p>
            <p class="excerpt">
              {{ item.excerpt }}
            </p>
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
              <el-button type="danger" plain @click="openItem(item)">
                Leer más
              </el-button>
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
        title: 'Colección “Nocturna” FW25',
        date: '2025-08-15',
        excerpt:
          'Presentamos texturas pesadas, cuero vegano y siluetas afiladas para dominar la noche.',
        image:
          'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1400&auto=format&fit=crop',
        author: 'Equipo LAG',
        tags: ['lanzamientos', 'colecciones', 'gotic'],
        url: 'https://lag.example/noticia/coleccion-nocturna',
      },
      {
        id: 2,
        title: 'Guía: cómo armar un total black con capas',
        date: '2025-08-10',
        excerpt:
          'Capas, proporciones y accesorios para un look monolítico con presencia.',
        image:
          'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop',
        author: 'Isa',
        tags: ['guías', 'estilo'],
      },
      {
        id: 3,
        title: 'Backstage del desfile “Ceniza & Carmesí”',
        date: '2025-07-29',
        excerpt:
          'Un vistazo íntimo a la preparación del show más oscuro del año.',
        image:
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop',
        author: 'LAG Studio',
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

