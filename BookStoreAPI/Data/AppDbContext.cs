using BookStore.Models;
using BookStore.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Product> Products => Set<Product>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Cart> Cart => Set<Cart>();

    public DbSet<Orders> Orders => Set<Orders>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
}