using BookStore.Data;
using BookStore.Models;
using BookStore.Data;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStoreAPI.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCart(int userId)
    {
        var cart = await _context.Cart
            .Include(x => x.Product)
            .Where(x => x.UserId == userId)
            .ToListAsync();

        return Ok(cart);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart(Cart cart)
    {
        _context.Cart.Add(cart);

        await _context.SaveChangesAsync();

        return Ok(cart);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveCartItem(int id)
    {
        var item = await _context.Cart.FindAsync(id);

        if (item == null)
            return NotFound();

        _context.Cart.Remove(item);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}