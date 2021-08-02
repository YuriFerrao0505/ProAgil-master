using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class LoteDto
    {
        public int Id { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required(ErrorMessage ="O campo {0} é Obrigatório")]
        public decimal Preco { get; set; }
        public string DataInicio { get; set; }
        public string DataFim { get; set; }
        [Range(2,120000)]
        public int Quantidade { get; set; }
    }
}