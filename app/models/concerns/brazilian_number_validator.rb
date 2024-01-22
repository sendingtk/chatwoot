require 'phonelib'

class BrazilianNumberValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.blank?

    phone = Phonelib.parse(value)

    return if phone.country != 'BR' || phone.valid? || phone.type != :mobile || phone.local_number.scan(/\d/).join.length >= 11

    nine_digit = 'Número esta inválido, se for um número de telefone móvel, acrescente o nono digito!'
    with_zero_in_ddd = 'Número esta inválido, retire o zero da frente do DDD!'
    message = value.starts_with?('+550') ? with_zero_in_ddd : (options[:message] || nine_digit)

    record.errors.add(attribute, message)
  end
end