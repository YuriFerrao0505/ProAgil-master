using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository 
{
    public class ProAgilRepository : IProAgilRepository
    {
        private readonly ProAgilContext _context;
        public ProAgilRepository(ProAgilContext context)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        //GERAIS
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public async Task<bool> SaveChangeAsync()
        {
            return (await _context.SaveChangesAsync()) >0;
        }

        //Evento
        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(c=>c.Lotes)
            .Include (c=> c.RedeSociais); 

            if (includePalestrantes){
                query = query
                .Include(pe => pe.palestranteEventos)
                .ThenInclude(p => p.Palestrante);
            }
            query = query.OrderByDescending(c => c.DataEvento);

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventosAsyncByTema(string tema, bool includePalestrantes)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(c=>c.Lotes)
            .Include (c=> c.RedeSociais); 

            if (includePalestrantes){
                query = query
                .Include(pe => pe.palestranteEventos)
                .ThenInclude(p => p.Palestrante);
            }

            query = query.OrderByDescending(c => c.DataEvento)
            .Where(c=>c.Tema.Contains(tema));

            return await query.ToArrayAsync();
        }
        public async Task<Evento> GetEventosAsyncById(int EventosId, bool includePalestrantes)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(c=>c.Lotes)
            .Include (c=> c.RedeSociais); 

            if (includePalestrantes){
                query = query
                .Include(pe => pe.palestranteEventos)
                .ThenInclude(p => p.Palestrante);
            }

            query = query.OrderByDescending(c => c.DataEvento)
            .Where(c=>c.Id==EventosId);

            return await query.FirstOrDefaultAsync();
        }

        //PALESTRANTE
        public async Task<Palestrante> GetPalestranteAsync(int PalestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include (c=> c.RedeSociais); 

            if (includeEventos){
                query = query
                .Include(pe => pe.palestranteEventos)
                .ThenInclude(e => e.Palestrante);
            }

            query = query.OrderBy(p => p.Nome)
            .Where(p=>p.Id ==PalestranteId);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Palestrante[]> GetAllPalestrantesAsyncByName(string name, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include (c=> c.RedeSociais); 

            if (includeEventos){
                query = query
                .Include(pe => pe.palestranteEventos)
                .ThenInclude(e => e.Palestrante);
            }

            query = query.Where(p=>p.Nome.ToLower().Contains(name.ToLower()));

            return await query.ToArrayAsync();
        }


    }
}