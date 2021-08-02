using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class EventoDto
    {
         public int Id { get; set; }
         [Required(ErrorMessage ="Camo Obrigatório")]
         [StringLength(100, MinimumLength =3, ErrorMessage ="Local é entre 3 e 100 Caracters")]
        public string Local { get; set; }
        public string DataEvento { get; set; }
        public string Tema { get; set; }
        [Required(ErrorMessage ="O Tema deve ser Preenchido")]
        public int QtdPessoas { get; set; }
        [Range(2,120000,ErrorMessage ="Quantidade de Pessoas é entre 2 e 120000")]
        public string ImagemUrl { get; set; }
        [Phone]
        public string Telefone { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedeSociais { get; set; }
        public List<PalestranteDto> palestrantes { get; set; }
    }
}